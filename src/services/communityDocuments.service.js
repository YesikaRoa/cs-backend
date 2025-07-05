import PDFDocument from 'pdfkit'
import { prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import path from 'path'

// --- Utilidades globales centralizadas ---
const LOGOS = {
  residence: {
    1: 'logoPirineosILoteG.png',
    2: 'logoLoteH.jpg',
    3: 'logoSinaral.png',
    4: 'logoRafaelUrdaneta.jpg',
  },
  disincorporation: {
    1: 'logoClapGeneral.jpg',
    2: 'logoClapGeneral.jpg',
    3: 'logoSinaralClap.png',
    4: 'logoRafaelUrdaneta.jpg',
  },
}

const CONTACTS = {
  residence: {
    1: {
      email: 'CCPIRINEOSILOTEG@GMAIL.COM',
      phones: '0426-7270336 / 0412-6832106',
    },
    2: {
      email: 'CONSEJOCOMUNALLOTEHURBZUNIGA@GMAIL.COM',
      phones: '0424-7427766',
    },
    3: { email: 'LUIS11ENERO2018@GMAIL.COM', phones: '0424-7570848' },
    4: {
      email: 'CLAPBLIBERTADORPA@GMAIL.COM',
      instagram: '@CLAPBLIBERTADORPA',
      phones: '0414-0748775 / 0424-7347467',
    },
  },
  disincorporation: {
    3: { email: 'luis11enero2018@gmail.com', phones: '0424-7570848' },
    4: {
      email: 'CLAPBLIBERTADORPA@GMAIL.COM',
      instagram: '@CLAPBLIBERTADORPA',
      phones: '0414-0748775 / 0424-7347467',
    },
  },
}

const STATIC_SIGNATURES = {
  residence: {
    1: [
      {
        name: 'JUDITH RAMÍREZ',
        ci: 'V- 10171652',
        role: 'V. COMITÉ ADMINISTRATIVA',
      },
      { name: 'MIGUEL RUEDA', ci: 'V- 11503980', role: 'V. UNIDAD EJECUTIVA' },
      {
        name: 'GLADYS CÁCERES',
        ci: 'V- 3618616',
        role: 'V. CONTRALORÍA SOCIAL',
      },
      {
        name: 'OLIVERIO VARGAS',
        ci: 'V- 4633172',
        role: 'V. DE COMISIÓN ELECTORAL',
      },
    ],
    2: [
      {
        name: 'GLADYS GAMBOA',
        ci: 'V- 3429447',
        role: 'V. COMITÉ DE ALIMENTACIÓN',
      },
      {
        name: 'DANIEL CHACÓN',
        ci: 'V- 4211215',
        role: 'V. CONTRALORÍA SOCIAL',
      },
      {
        name: 'LUIS USECHE',
        ci: 'V- 10166595',
        role: 'V. DE SEGURIDAD Y DEFENSA',
      },
      {
        name: 'WILLIAM RODRIGUEZ',
        ci: 'V- 9246485',
        role: 'V. DE COMISIÓN ELECTORAL',
      },
      {
        name: 'YASMIN GARCIA',
        ci: 'V- 10145578',
        role: 'V. DE COMISIÓN ELECTORAL',
      },
    ],
    3: [{ name: 'WOLFAN MENDOZA', ci: 'V- 1113752', role: 'VOCERO' }],
    4: [{ name: 'INGRY VIVAS', ci: 'V- 9218100', role: 'COMISIÓN ELECTORAL' }],
  },
  disincorporation: {
    1: [
      {
        name: '________________',
        ci: 'V-______________',
        role: 'LIDER DE CALLE',
      },
    ],
    2: [
      {
        name: '________________',
        ci: 'V-______________',
        role: 'LIDER DE CALLE',
      },
    ],
    3: [
      {
        name: '________________',
        ci: 'V-______________',
        role: 'LIDER DE CALLE',
      },
    ],
    4: [
      {
        name: '________________',
        ci: 'V-______________',
        role: 'LIDER DE CALLE',
      },
    ],
  },
}

const translateRoleName = (roleName) => {
  const translations = {
    COMMUNITY_LEADER: 'LÍDER COMUNITARIO',
    ADMIN: 'Administrador',
    MEMBER: 'Miembro',
  }
  return (
    translations[roleName.toUpperCase()] ||
    roleName.replace(/_/g, ' ').toLowerCase()
  )
}

const getFormattedDate = () => {
  const today = new Date()
  return today
    .toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '/')
}

// --- Función principal simplificada ---
export const generateDocumentService = async (
  communityId,
  documentType,
  personalData
) => {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
  })
  if (!community) throw createError('COMMUNITY_NOT_FOUND')

  const leaderRoleIds = [2]
  let communityLeaders = await prisma.user.findMany({
    where: {
      is_active: true,
      rol_id: { in: leaderRoleIds },
      community_id: communityId,
    },
    select: {
      first_name: true,
      last_name: true,
      dni: true,
      role: { select: { name: true } },
    },
  })

  // Si es carta de desincorporación para comunidad 1 o 2, traer también el líder de comunidad 1
  if (
    documentType === 'disincorporation' &&
    (communityId === 1 || communityId === 2)
  ) {
    communityLeaders = await prisma.user.findMany({
      where: {
        is_active: true,
        rol_id: { in: leaderRoleIds },
        community_id: communityId,
      },
      select: {
        first_name: true,
        last_name: true,
        dni: true,
        role: { select: { name: true } },
      },
    })
  }

  if (!communityLeaders || communityLeaders.length === 0) {
    throw createError('NO_COMMUNITY_LEADERS_FOUND')
  }

  const formattedLeaders = communityLeaders
    .map((user) => ({
      name: `${user.first_name} ${user.last_name}`,
      ci: `V- ${user.dni}`,
      role: translateRoleName(user.role.name),
    }))
    .sort((a, b) => (b.role.includes('LÍDER COMUNITARIO') ? 1 : -1))

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument()
      const buffers = []

      doc.on('data', (chunk) => buffers.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(buffers)))

      doc.fontSize(12).text(getFormattedDate(), 400, 20, { align: 'right' })
      doc.moveDown(1)

      addCommunityHeader(doc, communityId, documentType, community)
      doc.text('', 50, 100)
      doc.moveDown(5)

      if (documentType === 'residence') {
        generateResidenceDocument(
          doc,
          community,
          personalData,
          communityId,
          formattedLeaders
        )
      } else if (documentType === 'disincorporation') {
        generateDisincorporationDocument(
          doc,
          community,
          personalData,
          communityId,
          formattedLeaders
        )
      } else {
        throw createError('INVALID_DOCUMENT_TYPE')
      }

      doc.end()
    } catch (error) {
      console.error('Error generating PDF:', error)
      reject(error)
    }
  })
}

// --- Header simplificado ---
const addCommunityHeader = (doc, communityId, documentType, community) => {
  const logoFileName = LOGOS[documentType]?.[communityId]
  if (!logoFileName) return

  const logoPath = path.resolve('assets', logoFileName)
  doc.image(logoPath, 50, 30, { width: 100 })

  if (
    !(
      documentType === 'disincorporation' &&
      (communityId === 1 || communityId === 2)
    )
  ) {
    doc.fontSize(12).text(community.name, 200, 50, { align: 'right' })
    doc.text(community.address, 92, 70, {
      align: 'right',
      width: 450,
      lineBreak: false,
    })
    doc.text(community.rif_community, 200, 90, { align: 'right' })
  }
}

// --- Documentos ---
const generateResidenceDocument = (
  doc,
  community,
  personalData,
  communityId,
  leaders
) => {
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('CARTA DE RESIDENCIA', { align: 'center' })
  doc.moveDown(4)
  doc.fontSize(12).font('Helvetica')

  generateJustifiedTextWithBold(doc, [
    { text: 'Nosotros, integrantes del ', bold: false },
    { text: `${community.name}`, bold: true },
    { text: ', certificamos por medio de la presente que ', bold: false },
    { text: `${personalData.fullName}`, bold: true },
    { text: ', titular de la cédula de identidad N.º V-', bold: false },
    { text: `${personalData.idNumber}`, bold: true },
    { text: ', se encuentra residenciado/a en ', bold: false },
    { text: `${personalData.residence}.`, bold: true },
  ])

  doc.moveDown(2)
  doc
    .font('Helvetica')
    .text(
      `Constancia emitida para trámites personales. Solicitud que se expide a solicitud de la parte interesada, en San Cristóbal a los ${new Date().getDate()} días del mes de ${new Date().toLocaleString(
        'es-ES',
        { month: 'long' }
      )} del ${new Date().getFullYear()}.`,
      { align: 'justify' }
    )

  doc.moveDown(2)
  generateSignatures(doc, communityId, 'residence', leaders)
  doc.moveDown(3)
  addContactInfo(doc, communityId, 'residence')
}

const generateDisincorporationDocument = (
  doc,
  community,
  personalData,
  communityId,
  leaders
) => {
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('CONSTANCIA DE DESINCORPORACIÓN', { align: 'center' })
  doc.moveDown(2)

  doc.fontSize(12).font('Helvetica').text('Sres: ', { continued: true })
  doc.font('Helvetica-Bold').text(personalData.destinario, { align: 'justify' })
  doc.moveDown(2)

  generateJustifiedTextWithBold(doc, [
    {
      text: `Reciban de nuestra parte un saludo bolivariano, nosotros integrantes del `,
      bold: false,
    },
    { text: `${community.name_clap}`, bold: true },
    {
      text: `. Por medio de la presente nos dirigimos a ustedes con la finalidad de informarles que el Sr(a) `,
      bold: false,
    },
    { text: `${personalData.fullName}`, bold: true },
    {
      text: ` con cédula de identidad N.- V-${personalData.idNumber},`,
      bold: false,
    },
    {
      text: ` ya no recibe ningún beneficio alimenticio por parte de nuestra comunidad.`,
      bold: false,
    },
  ])

  doc.moveDown(2)
  doc.text(
    'Sin otro particular a que hacer referencia, se despiden de ustedes.',
    { align: 'justify' }
  )
  doc.moveDown(2)
  generateSignatures(doc, communityId, 'disincorporation', leaders)
  doc.moveDown(2)
  addContactInfo(doc, communityId, 'disincorporation')
}

// --- Firmas simplificadas ---
const generateSignatures = (doc, communityId, documentType, leaders) => {
  const staticSigns = STATIC_SIGNATURES[documentType][communityId] || [
    { name: 'N/A', ci: 'N/A', role: 'N/A' },
  ]
  const leadersOnly = leaders.filter((s) =>
    s.role.includes('LÍDER COMUNITARIO')
  )
  const othersLeaders = leaders.filter(
    (s) => !s.role.includes('LÍDER COMUNITARIO')
  )
  const signers = [...leadersOnly, ...staticSigns, ...othersLeaders]

  // Layout dinámico según cantidad de firmas
  let initialY = 470,
    columnWidth = 200,
    rowHeight = 90,
    maxColumns = 4
  if (
    communityId === 2 ||
    (communityId === 1 && documentType === 'residence')
  ) {
    columnWidth = 180
    rowHeight = 110
    maxColumns = 3
    initialY = 420
  } else if (signers.length === 2) {
    columnWidth = 300
    rowHeight = 100
    maxColumns = 2
    initialY = 550
  }

  signers.forEach((signer, index) => {
    const x = 50 + (index % maxColumns) * columnWidth
    const y = initialY + Math.floor(index / maxColumns) * rowHeight
    doc.font('Helvetica').text('________________', x, y)
    doc
      .font(signer.name !== '________________' ? 'Helvetica-Bold' : 'Helvetica')
      .text(signer.name, x, y + 20)
    doc
      .font(signer.ci !== 'V-______________' ? 'Helvetica-Bold' : 'Helvetica')
      .text(signer.ci, x, y + 40)
    doc.font('Helvetica-Bold').text(signer.role, x, y + 60)
  })
}

// --- Contacto simplificado ---
const addContactInfo = (doc, communityId, documentType) => {
  const contactInfo = CONTACTS[documentType]?.[communityId]
  if (!contactInfo) return

  const currentY = doc.y
  const remainingHeight = doc.page.height - currentY - doc.page.margins.bottom
  if (remainingHeight < 60) doc.moveDown(1)

  doc.fontSize(10).font('Helvetica').fillColor('black')
  const margin = 50,
    contentWidth = 595.28 - margin * 2

  if (contactInfo.email)
    doc.text(`CORREO: ${contactInfo.email}`, margin, null, {
      width: contentWidth,
      align: 'center',
      underline: true,
    })
  if (contactInfo.instagram)
    doc.text(`Instagram: ${contactInfo.instagram}`, margin, null, {
      width: contentWidth,
      align: 'center',
      underline: true,
    })
  if (contactInfo.phones)
    doc.text(`Teléfonos: ${contactInfo.phones}`, margin, null, {
      width: contentWidth,
      align: 'center',
      underline: true,
    })
}

// --- Utilidad para texto con negrita ---
const generateJustifiedTextWithBold = (doc, textSegments) => {
  textSegments.forEach(({ text, bold }) => {
    doc
      .font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .text(text, { continued: true })
  })
  doc.text('', { align: 'justify' })
}
