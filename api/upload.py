from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from docx import Document
from pdf2image import convert_from_bytes
import tempfile

app = Flask(__name__)
app.debug = True
ALLOWED_EXTENSIONS = {'docx', 'pdf'}

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/api/upload', methods=['POST'])
def upload_file():
    print("Received request for /api/upload/docx")

    if 'file' not in request.files:
        print("Error: No file part in the request")
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']

    if file.filename == '':
        print("Error: No selected file")
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename, {'docx'}):
        doc = Document(file.stream)
        print("Converting the Word document to Markdown")
        md_content = []
        for paragraph in doc.paragraphs:
            if paragraph.style.name.startswith('Heading'):
                level = int(paragraph.style.name[-1])
                md_content.append('#' * level + ' ' + paragraph.text)
            else:
                md_content.append(paragraph.text)
        md_string = '\n\n'.join(md_content)
        return jsonify({'message': 'File successfully converted', 'md_content': md_string}), 200

    print("Error: Invalid file type")
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/upload/pdf', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename, {'pdf'}):
        with tempfile.TemporaryDirectory() as path:
            images = convert_from_bytes(file.read(), output_folder=path)
            return jsonify({'message': f'Converted PDF to {len(images)} images'}), 200

    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
