import PDFDocument from 'pdfkit'
import { prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'

import path from 'path'

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

export const generateDocumentService = async (
  communityId,
  documentType,
  personalData
) => {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
  })

  if (!community) {
    throw new createError('COMMUNITY_NOT_FOUND')
  }

  const leaderRoleIds = [2] // Puedes agregar más IDs si es necesario
  const communityLeaders = await prisma.user.findMany({
    where: {
      is_active: true,
      rol_id: { in: leaderRoleIds },
      community_id: communityId,
    },
    select: {
      first_name: true,
      last_name: true,
      cedula: true,
      role: { select: { name: true } },
    },
  })

  // Formateo para generar firmas
  const formattedLeaders = communityLeaders.map((user) => ({
    name: `${user.first_name} ${user.last_name}`,
    ci: `V- ${user.cedula}`,
    role: translateRoleName(user.role.name),
  }))

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument()
      const buffers = []

      doc.on('data', (chunk) => buffers.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(buffers)))

      const today = new Date()
      const formattedDate = today
        .toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, '/')

      doc.fontSize(12).text(formattedDate, 400, 20, { align: 'right' })
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
    }
  })
}

const addCommunityHeader = (doc, communityId, documentType, community) => {
  const logosByDocumentType = {
    residence: {
      1: 'CONSEJO COMUNAL PIRENEOS I LOTE G.png',
      2: 'logoLoteH.jpg',
      3: 'logoConsejoComunalSinaral.png',
      4: 'logoRafaelUrdaneta.jpg',
    },
    disincorporation: {
      1: 'logoClapGeneral.jpg',
      2: 'logoClapGeneral.jpg',
      3: 'logoSinaralClap.png',
      4: 'logoRafaelUrdaneta.jpg',
    },
  }

  const logoFileName = logosByDocumentType[documentType]?.[communityId]
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
      align: 'right', // Alineación derecha
      width: 450, // Define el ancho del texto
      lineBreak: false, // Evita saltos de línea
    })

    doc.text(community.rif_community, 200, 90, { align: 'right' })
  }
}
// Formato 1: Carta de Residencia

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

// Formato 2: Constancia de Desincorporación
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
  doc
  doc
  const sresText = 'Sres: '
  const destinatarioText = personalData.destinario

  doc.fontSize(12).font('Helvetica') // texto normal
  doc.text(sresText, { continued: true }) // continued:true para seguir en la misma línea

  doc.font('Helvetica-Bold') // negrita
  doc.text(destinatarioText, { align: 'justify' }) // el resto de la línea con negrita

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
      text: `con cédula de identidad N.- V-${personalData.idNumber},`,
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

//firmas

const generateSignatures = (doc, communityId, documentType, leaders) => {
  // Firmas fijas por comunidad y tipo de documento
  const staticSignatures = {
    1:
      documentType === 'residence'
        ? [
            {
              name: 'JUDITH RAMÍREZ',
              ci: 'V- 10.171.652',
              role: 'V. COMITÉ ADMINISTRATIVA',
            },
            {
              name: 'MIGUEL RUEDA',
              ci: 'V- 11.503.980',
              role: 'V. UNIDAD EJECUTIVA',
            },
            {
              name: 'GLADYS CÁCERES',
              ci: 'V- 3.618.616',
              role: 'V. CONTRALORÍA SOCIAL',
            },
            {
              name: 'OLIVERIO VARGAS',
              ci: 'V- 4.633.172',
              role: 'V. DE COMISIÓN ELECTORAL',
            },
          ]
        : [
            {
              name: '________________',
              ci: 'V-______________',
              role: 'LIDER DE CALLE',
            },
          ],
    2:
      documentType === 'residence'
        ? [
            {
              name: 'GLADYS GAMBOA',
              ci: 'V- 3.429.447',
              role: 'V. COMITÉ DE ALIMENTACIÓN',
            },
            {
              name: 'DANIEL CHACÓN',
              ci: 'V- 4.211.215',
              role: 'V. CONTRALORÍA SOCIAL',
            },
            {
              name: 'LUIS USECHE',
              ci: 'V- 10.166.595',
              role: 'V. DE SEGURIDAD Y DEFENSA',
            },
            {
              name: 'WILLIAM RODRIGUEZ',
              ci: 'V- 9.246.485',
              role: 'V. DE COMISIÓN ELECTORAL',
            },
            {
              name: 'YASMIN GARCIA',
              ci: 'V- 10.145.578',
              role: 'V. DE COMISIÓN ELECTORAL',
            },
          ]
        : [
            {
              name: '________________',
              ci: 'V-______________',
              role: 'LIDER DE CALLE',
            },
          ],
    3:
      documentType === 'residence'
        ? [{ name: 'WOLFAN MENDOZA', ci: 'V- 11.113.752', role: 'VOCERO' }]
        : [
            {
              name: '________________',
              ci: 'V-______________',
              role: 'LIDER DE CALLE',
            },
          ],
    4:
      documentType === 'residence'
        ? [
            {
              name: 'INGRY VIVAS',
              ci: 'V- 9.218.100',
              role: 'COMISIÓN ELECTORAL',
            },
          ]
        : [
            {
              name: '________________',
              ci: 'V-______________',
              role: 'LIDER DE CALLE',
            },
          ],
  }

  // Combinar firmas estáticas con las dinámicas (líderes)
  // leaders debe ser un arreglo de objetos con { name, ci, role }
  const signers = [
    ...(staticSignatures[communityId] || [
      { name: 'N/A', ci: 'N/A', role: 'N/A' },
    ]),
    ...leaders,
  ]

  // Configuración para la posición de las firmas
  let initialY = 470
  let columnWidth = 200
  let rowHeight = 90
  let maxColumns = 4

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

  // Dibujar firmas en el PDF
  signers.forEach((signer, index) => {
    const xPosition = 50 + (index % maxColumns) * columnWidth
    const yPosition = initialY + Math.floor(index / maxColumns) * rowHeight

    doc.font('Helvetica').text('________________', xPosition, yPosition)

    if (signer.name !== '________________') {
      doc.font('Helvetica-Bold').text(signer.name, xPosition, yPosition + 20)
    } else {
      doc.font('Helvetica').text(signer.name, xPosition, yPosition + 20)
    }

    if (signer.ci !== 'V-______________') {
      doc.font('Helvetica-Bold').text(signer.ci, xPosition, yPosition + 40)
    } else {
      doc.font('Helvetica').text(signer.ci, xPosition, yPosition + 40)
    }

    doc.font('Helvetica-Bold').text(signer.role, xPosition, yPosition + 60)
  })
}

//contacto
const addContactInfo = (doc, communityId, documentType) => {
  const contactsByType = {
    residence: {
      1: {
        email: 'CCPIRINEOSILOTEG@GMAIL.COM',
        phones: '0426-7270336 / 0412-6832106',
      },
      2: {
        email: 'CONSEJOCOMUNALLOTEHURBZUNIGA@GMAIL.COM',
        phones: '0424-7427766',
      },
      3: {
        email: 'LUIS11ENERO2018@GMAIL.COM',
        phones: '0424-7570848',
      },
      4: {
        email: 'CLAPBLIBERTADORPA@GMAIL.COM',
        instagram: '@CLAPBLIBERTADORPA',
        phones: '0414-0748775 / 0424-7347467',
      },
    },
    disincorporation: {
      3: {
        email: 'luis11enero2018@gmail.com',
        phones: '0424-7570848',
      },
      4: {
        email: 'CLAPBLIBERTADORPA@GMAIL.COM',
        instagram: '@CLAPBLIBERTADORPA',
        phones: '0414-0748775 / 0424-7347467',
      },
    },
  }

  const contacts = contactsByType[documentType] || {}
  const contactInfo = contacts[communityId]

  if (!contactInfo) {
    return // No mostrar nada si no hay datos de contacto
  }

  const currentY = doc.y // Posición actual del cursor
  const remainingHeight = doc.page.height - currentY - doc.page.margins.bottom // Espacio disponible

  const estimatedHeight = 60 // Estimación del espacio requerido para la información de contacto

  // Si no hay espacio suficiente, ajusta la posición
  if (remainingHeight < estimatedHeight) {
    doc.moveDown(1) // Agregar espacio o ajustar el diseño
  }

  doc.fontSize(10).font('Helvetica').fillColor('black')
  const pageWidth = 595.28 // Tamaño de la página
  const margin = 50 // Márgenes
  const contentWidth = pageWidth - margin * 2

  if (contactInfo.email) {
    doc.text(`CORREO: ${contactInfo.email}`, margin, null, {
      width: contentWidth,
      align: 'center',
      underline: true,
    })
  }
  if (contactInfo.instagram) {
    doc.text(`Instagram: ${contactInfo.instagram}`, margin, null, {
      width: contentWidth,
      align: 'center',
      underline: true,
    })
  }
  if (contactInfo.phones) {
    doc.text(`Teléfonos: ${contactInfo.phones}`, margin, null, {
      width: contentWidth,
      align: 'center',
      underline: true,
    })
  }
}

const generateJustifiedTextWithBold = (doc, textSegments) => {
  textSegments.forEach(({ text, bold }) => {
    doc
      .font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .text(text, { continued: true })
  })
  doc.text('', { align: 'justify' })
}
