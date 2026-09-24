# AlgoVision AI

> An interactive web-based platform for visualizing and understanding algorithms.

AlgoVision AI is a full-stack algorithm visualization project designed to make algorithm execution easier to understand through interactive visualizations.

The project combines a **Django backend** with a **React-based frontend** to provide algorithm execution and visualization in a web interface.

---

## ✨ Features

- Interactive algorithm visualization
- Graph-based algorithm execution
- Step-by-step algorithm execution
- Visual representation of algorithm operations
- REST API-based backend
- React-based interactive frontend
- Modular algorithm engine architecture
- Separate backend and frontend structure

---

## 🧠 Algorithms

The project currently contains implementations for:

### Graph Algorithms
- **Breadth-First Search (BFS)**
- **Depth-First Search (DFS)**
- **Dijkstra's Algorithm**
- **Prim's Algorithm**

### Sorting Algorithms
- **Bubble Sort**
- **Merge Sort**
- **Quick Sort**

---

## 🛠️ Tech Stack

### Backend
- Python
- Django
- Django REST Framework

### Frontend
- React
- Vite
- React Flow
- JavaScript
- HTML5
- CSS3

### Development Tools
- Git
- GitHub
- VS Code

---

## 📁 Project Structure

```text
AlgoVision-AI/
│
├── algorithms/
│   ├── engine/
│   │   ├── bfs.py
│   │   ├── dfs.py
│   │   ├── dijkstra.py
│   │   ├── prims.py
│   │   ├── bubble_sort.py
│   │   ├── merge_sort.py
│   │   └── quick_sort.py
│   │
│   ├── models.py
│   ├── urls.py
│   ├── views.py
│   └── tests.py
│
├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── manage.py
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/alferdousrana/AlgoVision-AI.git
```

Move into the project directory:

```bash
cd AlgoVision-AI
```

---

## 🐍 Backend Setup

Create a Python virtual environment:

### Windows

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
venv\Scripts\activate
```

Install the required Python packages:

```powershell
pip install django djangorestframework
```

Run migrations:

```powershell
python manage.py migrate
```

Start the Django development server:

```powershell
python manage.py runserver
```

The backend will normally be available at:

```text
http://127.0.0.1:8000/
```

---

## ⚛️ Frontend Setup

Open another terminal and navigate to the frontend:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Vite will display the local development URL in the terminal.

---

## 🔌 Backend API

The Django backend provides API endpoints for algorithm execution.

Example endpoints include:

```text
/api/algorithms/bfs/
/api/algorithms/dfs/
/api/algorithms/dijkstra/
```

These endpoints are used by the frontend to communicate with the algorithm engine.

---

## 🎯 Project Goal

The main goal of AlgoVision AI is to provide an interactive environment where learners can better understand how algorithms work by observing their execution visually rather than relying only on traditional code-based explanations.

---

## 🚀 Future Improvements

Planned improvements may include:

- More algorithm visualizations
- Improved step-by-step execution
- Interactive graph editing
- Additional sorting algorithms
- Better algorithm complexity information
- Improved UI/UX
- Algorithm comparison features
- More detailed execution traces

---

## 👨‍💻 Author

**Md. Al Ferdous**

Python/Django Backend Developer

GitHub:  
https://github.com/alferdousrana

---

## 📄 License

This project is currently intended for educational and portfolio purposes.