from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from docx import Document
import os

app = Flask(__name__)
UPLOAD_FOLDER = '/mnt/data'
ALLOWED_EXTENSIONS = {'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Load the Word document
        doc = Document(file_path)

        # Convert the Word document to Markdown
        md_content = []
        for paragraph in doc.paragraphs:
            # Convert headings
            if paragraph.style.name.startswith('Heading'):
                level = int(paragraph.style.name[-1])
                md_content.append('#' * level + ' ' + paragraph.text)
            else:
                md_content.append(paragraph.text)

        # Save the markdown content to a .md file
        md_path = os.path.splitext(file_path)[0] + ".md"
        with open(md_path, 'w') as md_file:
            md_file.write('\n\n'.join(md_content))

        return jsonify({'message': 'File successfully converted', 'md_file_path': md_path}), 200

    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
