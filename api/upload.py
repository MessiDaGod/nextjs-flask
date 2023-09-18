from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from docx import Document
from pdf2image import convert_from_bytes
import tempfile
import base64
from io import BytesIO
import shutil
import logging
import os

app = Flask(__name__)
app.debug = True
# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
ALLOWED_EXTENSIONS = {'docx', 'pdf'}

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Handle DOCX
    if file and allowed_file(file.filename, {'docx'}):
        doc = Document(file.stream)
        md_content = []
        for paragraph in doc.paragraphs:
            if paragraph.style.name.startswith('Heading'):
                level = int(paragraph.style.name[-1])
                md_content.append('#' * level + ' ' + paragraph.text)
            else:
                md_content.append(paragraph.text)
        md_string = '\n\n'.join(md_content)
        return jsonify({'message': 'File successfully converted', 'md_content': md_string}), 200

    # Handle PDF
    elif file and allowed_file(file.filename, {'pdf'}):
        with tempfile.TemporaryDirectory() as path:
            images = convert_from_bytes(file.read(), output_folder=path)
            base64_images = []
            for img in images:
                buffered = BytesIO()
                img.save(buffered, format="PNG")
                img_str = base64.b64encode(buffered.getvalue()).decode()
                base64_images.append(img_str)
            return jsonify({'message': f'Converted PDF to {len(images)} images', 'images': base64_images}), 200

    # Invalid file type
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/upload', methods=['GET'])
def copy_pdf_worker():
    try:
        # Determine the current working directory
        current_dir = os.getcwd()
        logger.debug(f"Current directory: {current_dir}")

        pdfjs_dist_path = os.path.join(current_dir, 'node_modules', 'pdfjs-dist')
        if not os.path.exists(pdfjs_dist_path):
            logger.error(f"pdfjsDistPath doesn't exist: {pdfjs_dist_path}")
            return jsonify(success=False, message="pdfjsDistPath doesn't exist"), 500

        pdf_worker_path = os.path.join(pdfjs_dist_path, 'build', 'pdf.worker.js')
        if not os.path.exists(pdf_worker_path):
            logger.error(f"pdfWorkerPath doesn't exist: {pdf_worker_path}")
            return jsonify(success=False, message="pdfWorkerPath doesn't exist"), 500

        # Rest of the code remains unchanged...

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return jsonify(success=False, message=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
s