## Installation

Note that you might need to open this folder alone in Visual Studio Code for the virtual environment to be detected to correctly run the notebook provided.

## Step 1: Create a Virtual Environment

```bash
python -m venv venv
```

Activate the virtual environment:

* On **Windows**:
  ```bash
  venv\Scripts\activate
  ```

* On **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

## Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 3: Run the script:

You can run the notebook provided `YOLO_notebook.ipynb`, or you can directly run the script using:

```bash
python YOLO_script.py
```

This will create a folder `Output Videos` that contains the output.
