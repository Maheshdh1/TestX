import { Document, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';

export async function downloadDoc(questions) {
  const paragraphs = [
    new Paragraph({ text: 'Question Paper', heading: 'Heading1' }),
    new Paragraph({ text: '-----------------------------' }),
  ];

  questions.forEach((q, idx) => {
    paragraphs.push(new Paragraph(`${idx + 1}. ${q}`));
  });

  const doc = new Document({
    sections: [{ children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'question-paper.docx');
}
