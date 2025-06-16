import { generateDocumentService } from '../services/communityDocuments.service.js'

export const generateDocument = async (req, res, next) => {
  try {
    const communityId = parseInt(req.body.communityId, 10)
    const { documentType, personalData } = req.body

    // Llama al servicio para generar el documento
    const pdfBuffer = await generateDocumentService(
      communityId,
      documentType,
      personalData
    )

    // Devuelve el PDF
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${documentType}.pdf`
    )
    res.status(200).send(pdfBuffer)
  } catch (error) {
    console.error('Error en generateDocument:', error)
    next(error)
  }
}
