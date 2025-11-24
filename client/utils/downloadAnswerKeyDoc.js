import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export async function downloadAnswerKeyDoc(questions) {
  const paragraphs = [
    new Paragraph({ text: 'Answer Key', heading: 'Heading1' }),
    new Paragraph({ text: '-----------------------------' }),
  ];

  questions.forEach((q, idx) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${idx + 1}. ${q.text}`, bold: true }),
        ],
      })
    );

    if (q.options && q.options.length && typeof q.correctAnswerIndex === 'number') {
      const correct = q.options[q.correctAnswerIndex];
      const label = String.fromCharCode(65 + q.correctAnswerIndex);
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Answer: (${label}) ${correct}`, italics: true }),
          ],
        })
      );
    } else {
      paragraphs.push(new Paragraph('Answer: ____________'));
    }

    paragraphs.push(new Paragraph(''));
  });

  const doc = new Document({
    sections: [{ children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'answer-key.docx');
}
