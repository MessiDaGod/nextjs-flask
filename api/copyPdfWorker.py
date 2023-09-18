from flask import Flask, jsonify
import os
import shutil
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/copyPdfWorker', methods=['GET'])
def copy_pdf_worker():
    try:
        # Determine the path where 'pdfjs-dist' is installed (usually in node_modules)
        # NOTE: You'll need to adjust this according to your project's structure
        pdfjs_dist_path = os.path.dirname(os.path.abspath('node_modules/pdfjs-dist/package.json'))
        logger.debug(f"pdfjsDistPath determined: {pdfjs_dist_path}")

        pdf_worker_path = os.path.join(pdfjs_dist_path, 'build', 'pdf.worker.js')
        logger.debug(f"pdfWorkerPath determined: {pdf_worker_path}")

        # Check if destination directory exists or create it
        if not os.path.exists('./dist'):
            os.makedirs('./dist')
            logger.debug("Destination directory './dist' created")

        # Copy the file
        shutil.copyfile(pdf_worker_path, './dist/pdf.worker.js')
        logger.info("Successfully copied the PDF Worker")

        return jsonify(success=True, message="PDF Worker copied successfully!"), 200

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return jsonify(success=False, message=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
