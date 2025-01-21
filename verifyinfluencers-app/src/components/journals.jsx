import React, { useState, useEffect, useCallback } from 'react';

const Scientificjournals = ({ onJournalSelect }) => {
    // Estado para manejar journals dinámicamente con persistencia
    const [journals, setJournals] = useState(() => {
        const savedJournals = localStorage.getItem('scientificJournals');
        return savedJournals 
            ? JSON.parse(savedJournals)
            : [
                'PubMed Central',
                'Science',
                'The Lancet', 
                'JAMA Network', 
                'Nature',
                'Cell', 
                'New England Journal of Medicine'
            ];
    });

    // Estados para manejo de selección y adición de journals
    const [selectedJournals, setSelectedJournals] = useState([]);
    const [isAddingNewJournal, setIsAddingNewJournal] = useState(false);
    const [newJournalName, setNewJournalName] = useState('');

    // Efecto para guardar journals en localStorage
    useEffect(() => {
        localStorage.setItem('scientificJournals', JSON.stringify(journals));
    }, [journals]);

    // Efecto para notificar journals seleccionados
    useEffect(() => {
        if (onJournalSelect) {
            onJournalSelect(selectedJournals);
        }
    }, [selectedJournals, onJournalSelect]);

    // Función para alternar selección de journal
    const toggleJournal = useCallback((journal) => {
        setSelectedJournals(prev => 
            prev.includes(journal)
            ? prev.filter(j => j !== journal)
            : [...prev, journal]
        );
    }, []);

    // Seleccionar todos los journals
    const selectAll = useCallback(() => { 
        setSelectedJournals([...journals]);
    }, [journals]);

    // Deseleccionar todos los journals
    const deselectAll = useCallback(() => {
        setSelectedJournals([]);
    }, []); 

    // Función para añadir nuevo journal
    const handleAddNewJournal = useCallback(() => {
        const trimmedJournalName = newJournalName.trim();
        
        // Validaciones
        if (!trimmedJournalName) {
            alert('Journal name cannot be empty');
            return;
        }

        if (journals.some(journal => 
            journal.toLowerCase() === trimmedJournalName.toLowerCase()
        )) {
            alert('This journal already exists');
            return;
        }

        // Añadir nuevo journal
        const updatedJournals = [...journals, trimmedJournalName];
        
        // Actualizar estado de journals
        setJournals(updatedJournals);
        
        // Seleccionar automáticamente el nuevo journal
        setSelectedJournals(prev => [...prev, trimmedJournalName]);
        
        // Resetear estados
        setNewJournalName('');
        setIsAddingNewJournal(false);
    }, [journals, newJournalName]);

    return (
        <div className="scientific-journals-container" style={{
            background: 'rgb(55, 53, 53)',
            padding: '15px',
            borderRadius: '10px'
        }}>
            <div className='button-select' style={{
                color: 'teal',
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
            }}> 
                <h3 style={{ color: 'white', margin: 0 }}>Scientific Journals</h3>
                <div>
                    <button type='button'
                        onClick={selectAll}
                        style={{
                            marginRight: '10px',
                            backgroundColor: 'rgba(0, 128, 128, 0.2)',
                            color: 'teal',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px'
                        }}
                    >
                        Select All
                    </button>
                    <button type='button'
                        onClick={deselectAll}
                        style={{
                            backgroundColor: 'rgba(231, 76, 60, 0.2)',
                            color: '#e74c3c',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px'
                        }}
                    >
                        Deselect All
                    </button>
                </div>
            </div>

            <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
            }}>
                {journals.map(journal => (
                    <button type='button'
                        key={journal}
                        onClick={() => toggleJournal(journal)} 
                        style={{
                            backgroundColor: selectedJournals.includes(journal)
                                ? 'rgba(46, 204, 113, 0.5)'
                                : 'rgba(30, 29, 29, 0.559)', 
                            color: 'white',
                            border: '1px solid gray',
                            borderRadius: '5px',
                            padding: '10px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {journal}
                    </button>
                ))}

                {isAddingNewJournal ? (
                    <div style={{
                        display: 'flex',
                        gridColumn: '1 / -1'
                    }}>
                        <input 
                            type="text"
                            value={newJournalName}
                            onChange={(e) => setNewJournalName(e.target.value)}
                            placeholder="Enter journal name"
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: 'rgba(30, 29, 29, 0.559)',
                                color: 'white',
                                border: '1px solid gray',
                                borderRadius: '5px',
                                marginRight: '10px'
                            }}
                        />
                        <button type='button'
                            onClick={handleAddNewJournal}
                            style={{
                                backgroundColor: 'teal',
                                color: 'white',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '5px'
                            }}
                        >
                            Add
                        </button>
                        <button type='button'
                            onClick={() => setIsAddingNewJournal(false)}
                            style={{
                                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                                color: '#e74c3c',
                                border: 'none',
                                padding: '10px',
                                borderRadius: '5px',
                                marginLeft: '10px'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button type='button'
                        onClick={() => setIsAddingNewJournal(true)}
                        style={{
                            color: 'teal',
                            backgroundColor: 'rgba(0, 128, 128, 0.2)',
                            border: '1px dashed teal',
                            borderRadius: '5px',
                            padding: '10px',
                            gridColumn: '1 / -1'
                        }}
                    >
                        + Add New Journal
                    </button>
                )}
            </div>

            {selectedJournals.length > 0 && (
                <div style={{
                    marginTop: '15px',
                    color: 'white'
                }}>
                    <strong>Selected Journals:</strong> {selectedJournals.join(', ')}
                </div>
            )}
        </div>
    );
};

export default Scientificjournals;