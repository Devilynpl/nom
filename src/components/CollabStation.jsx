import React, { useState, useEffect } from 'react';
import { Folder, Music, FileAudio, Share2, Plus, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CollabStation.css';

const CollabStation = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/api/collab/projects?userId=${user.id}`)
                .then(res => res.json())
                .then(data => setProjects(data));
        }
    }, [user]);

    const handleCreate = async () => {
        const name = prompt("Project Name:");
        if (!name) return;

        const type = prompt("Type (Logic Pro, Ableton, Stems):", "Logic Pro");

        const newProject = {
            name,
            owner: user.name,
            type,
            size: '0 MB',
            collaborators: [],
            id: Date.now()
        };

        const res = await fetch('http://localhost:5000/api/collab/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProject)
        });
        const data = await res.json();
        setProjects([data, ...projects]);
    };

    const getIcon = (type) => {
        if (type.includes('WAV') || type.includes('Stems')) return <FileAudio size={32} color="#00f2ff" />;
        return <Folder size={32} color="#ffd700" />;
    };

    return (
        <div className="collab-container animate-fade">
            <div className="collab-header">
                <div className="header-left">
                    <h1>Collaboration Station</h1>
                    <p>Cloud workspace for your stems and project files.</p>
                </div>
                <button className="new-project-btn" onClick={handleCreate}>
                    <Plus size={20} /> New Project
                </button>
            </div>

            <div className="projects-grid">
                {projects.length > 0 ? projects.map(project => (
                    <div key={project.id} className="project-card glass hover-glow">
                        <div className="card-top">
                            {getIcon(project.type)}
                            <button className="share-btn" title="Share"><Share2 size={16} /></button>
                        </div>
                        <div className="card-info">
                            <h3>{project.name}</h3>
                            <span className="type-tag">{project.type}</span>
                            <div className="meta">
                                <span>{project.size}</span>
                                <span><Clock size={12} /> {project.updated}</span>
                            </div>
                        </div>
                        {project.collaborators.length > 0 && (
                            <div className="collab-avatars">
                                {project.collaborators.map((c, i) => (
                                    <div key={i} className="avatar-mini" title={c}>{c[0]}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="empty-projects">
                        <Folder size={64} style={{ opacity: 0.3 }} />
                        <p>No projects found. Start a new one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollabStation;
