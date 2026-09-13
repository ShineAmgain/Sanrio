# Islington College R&D Digital Hub

## Project Overview

The Islington College R&D Digital Hub is a web-based platform designed to provide a centralized digital space for managing and presenting the college's Research and Development activities.

The system allows users to explore research areas, projects, researchers, publications, and other R&D-related information through a structured and user-friendly interface.

The platform also includes an administrative section for managing the content and information displayed within the system.

## Objectives

The main objectives of the project are:

* To create a centralized platform for Islington College's Research and Development activities.
* To make research projects and researchers easier to discover.
* To provide organized information about research areas and publications.
* To improve accessibility to R&D-related information.
* To provide an administrative interface for managing system content.
* To create a responsive and user-friendly interface.

## Main Features

### User Side

* Home page
* About R&D section
* Research areas
* Research projects
* Researchers
* Publications
* Researcher details
* Project details
* Search functionality
* Responsive navigation
* Loading and error states
* Back navigation
* Responsive design

### Admin Side

* Admin dashboard
* Manage researchers
* Manage research projects
* Manage research areas
* Manage publications
* Add new records
* Edit existing records
* Delete records
* Manage R&D-related content

## Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* React Router

### Backend and Database

* Supabase
* PostgreSQL

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Cursor

## Design

The user interface was designed with a focus on:

* Simple and clean layout
* Consistent typography
* Clear navigation
* Responsive design
* Easy access to research information
* User-friendly interactions
* Consistent spacing and component structure

## Project Structure

```text
project/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── README.md
└── ...
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project

```bash
cd <project-folder>
```

### 3. Navigate to the Frontend

```bash
cd frontend
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will then be available through the local development URL shown in the terminal.

## Environment Variables

The project requires environment variables for connecting to Supabase.

Create a `.env` file inside the frontend directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit private credentials or secret keys to the repository.

## Testing and Debugging

During development, the application was tested by:

* Running the application locally
* Testing navigation between pages
* Checking API and database interactions
* Testing CRUD functionality
* Checking responsive layouts
* Identifying and fixing UI issues
* Debugging JavaScript and React errors
* Testing different user interactions

## Security

* Sensitive environment variables are stored outside the source code.
* Database credentials and private keys should not be committed to GitHub.
* Authentication and database access should be controlled through appropriate Supabase policies.

## Responsive Design

The application is designed to work across different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile devices

## Learning and Development

This project provided practical experience in:

* React.js development
* Component-based architecture
* JavaScript
* API integration
* Supabase
* PostgreSQL
* CRUD operations
* Responsive web design
* Git and GitHub
* Debugging and troubleshooting
* UI/UX implementation

## Contributors

Developed as part of the Islington College Research and Development Digital Hub project.

## License

This project was developed for academic purposes.
