from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from docx import Document
import os

app = Flask(__name__)
ALLOWED_EXTENSIONS = {'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    print("Received request for /api/upload")

    # Check if the post request has the file part
    if 'file' not in request.files:
        print("Error: No file part in the request")
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename.
    if file.filename == '':
        print("Error: No selected file")
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        # Load the Word document from uploaded file content
        doc = Document(file.stream)

        # Convert the Word document to Markdown
        print("Converting the Word document to Markdown")
        md_content = []
        for paragraph in doc.paragraphs:
            # Convert headings
            if paragraph.style.name.startswith('Heading'):
                level = int(paragraph.style.name[-1])
                md_content.append('#' * level + ' ' + paragraph.text)
            else:
                md_content.append(paragraph.text)

        # Join the markdown content to form the final markdown string
        md_string = '\n\n'.join(md_content)
        return jsonify({'message': 'File successfully converted', 'md_content': md_string}), 200

    print("Error: Invalid file type")
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
