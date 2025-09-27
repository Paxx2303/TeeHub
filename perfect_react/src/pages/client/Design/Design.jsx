import React, { useState, useRef, useCallback } from 'react';

const TShirtDesigner = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [tshirtColor, setTshirtColor] = useState('#ffffff');
  const [nextId, setNextId] = useState(1);
  const [dragData, setDragData] = useState(null);
  const canvasRef = useRef(null);

  // Predefined decoration images
  const decorationImages = [
    { id: 'star', name: 'Ngôi sao', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
    { id: 'heart', name: 'Trái tim', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
    { id: 'music', name: 'Nốt nhạc', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>' },
    { id: 'crown', name: 'Vương miện', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 12.5l3.5 1.5L12 8l5.5 6L21 12.5L19 16v3H5v-3z"/></svg>' },
    { id: 'lightning', name: 'Sét', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/></svg>' },
    { id: 'diamond', name: 'Kim cương', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12l3 6-9 12L3 8l3-6z"/></svg>' },
    { id: 'flower', name: 'Hoa', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.49 10 10-4.49 10-10 10zm0-18c-4.41 0-8 3.59-8 8 0 1.82.62 3.49 1.64 4.83 1.43-1.74 4.9-2.33 6.36-2.33s4.93.59 6.36 2.33C19.38 15.49 20 13.82 20 12c0-4.41-3.59-8-8-8z"/></svg>' },
    { id: 'rocket', name: 'Tên lửa', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.44 5.58s2.12.21 4.41.21c.79 0 1.55-.05 2.23-.13-.01-.28-.01-.56-.01-.85 0-1.88.28-3.82.81-5.81zM10.56 12c-1.33.05-2.76.07-4.13.07v-.02c.5-1.25 1.26-2.44 2.27-3.52.36 1.23.53 2.37.61 3.47zM12 2C8.73 7.84 7 15.55 9.05 22c.42-.02.82-.08 1.21-.2 1.37-4.77 2.24-9.89 1.74-15.8C11.58 4.69 11.79 3.34 12 2zM16.97 12c0 1.39-.17 2.75-.5 4.03-.77.27-1.56.47-2.35.6.5-1.21.85-2.56.85-4.03 0-.69-.07-1.35-.2-2h2.2z"/></svg>' }
  ];

  const addTextElement = () => {
    const newElement = {
      id: nextId,
      type: 'text',
      content: 'Sample Text',
      x: 150,
      y: 200,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      rotation: 0
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setNextId(nextId + 1);
  };

  const addImageElement = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newElement = {
            id: nextId,
            type: 'image',
            src: event.target.result,
            x: 150,
            y: 150,
            width: 100,
            height: 100,
            rotation: 0
          };
          setElements((prev) => [...prev, newElement]);
          setSelectedElement(newElement.id);
          setNextId((prev) => prev + 1);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addDecorationElement = (decoration) => {
    const newElement = {
      id: nextId,
      type: 'decoration',
      svg: decoration.svg,
      name: decoration.name,
      x: 150,
      y: 150,
      width: 60,
      height: 60,
      color: '#000000',
      rotation: 0
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElement(newElement.id);
    setNextId((prev) => prev + 1);
  };

  const updateElement = (id, updates) => {
    setElements((prev) => prev.map(el => (el.id === id ? { ...el, ...updates } : el)));
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const handleMouseDown = useCallback((e, elementId) => {
    e.preventDefault();
    setSelectedElement(elementId);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    setDragData({
      elementId,
      startX: e.clientX - rect.left - element.x,
      startY: e.clientY - rect.top - element.y
    });
  }, [elements]);

  const handleMouseMove = useCallback((e) => {
    if (!dragData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragData.startX;
    const newY = e.clientY - rect.top - dragData.startY;

    updateElement(dragData.elementId, { x: newX, y: newY });
  }, [dragData]);

  const handleMouseUp = useCallback(() => {
    setDragData(null);
  }, []);

  React.useEffect(() => {
    if (dragData) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragData, handleMouseMove, handleMouseUp]);

  const selectedElementData = elements.find(el => el.id === selectedElement);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '300px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>T-Shirt Designer</h2>

        {/* Tools */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Công cụ</h3>
          <button
            onClick={addTextElement}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Thêm Text
          </button>
          <button
            onClick={addImageElement}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Thêm Hình ảnh
          </button>
        </div>

        {/* Decoration Images */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Trang trí có sẵn</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
          }}>
            {decorationImages.map((decoration) => (
              <div
                key={decoration.id}
                onClick={() => addDecorationElement(decoration)}
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#34495e',
                  border: '2px solid #5a6c7d',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3498db';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#34495e';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title={decoration.name}
                dangerouslySetInnerHTML={{
                  __html: decoration.svg.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="24" height="24"')
                }}
              />
            ))}
          </div>
        </div>

        {/* T-shirt color */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Màu áo</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '15px'
          }}>
            {[
              '#ffffff', '#000000', '#ff0000', '#00ff00',
              '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
              '#ffa500', '#800080', '#ffc0cb', '#a52a2a',
              '#808080', '#add8e6', '#90ee90', '#dda0dd'
            ].map((color) => (
              <div
                key={color}
                onClick={() => setTshirtColor(color)}
                style={{
                  width: '35px',
                  height: '35px',
                  backgroundColor: color,
                  border: tshirtColor === color ? '3px solid #3498db' : '2px solid #bdc3c7',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: tshirtColor === color ? '0 2px 8px rgba(52, 152, 219, 0.3)' : 'none'
                }}
                title={color}
              />
            ))}
          </div>
          <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>
              Màu tùy chỉnh:
            </label>
            <input
              type="color"
              value={tshirtColor}
              onChange={(e) => setTshirtColor(e.target.value)}
              style={{
                width: '100%',
                height: '35px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        {/* Properties panel */}
        {selectedElementData && (
          <div>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
              Thuộc tính {selectedElementData.type === 'text' ? 'Text' :
                selectedElementData.type === 'decoration' ? 'Trang trí' : 'Hình ảnh'}
            </h3>

            {selectedElementData.type === 'text' && (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Nội dung:
                  </label>
                  <input
                    type="text"
                    value={selectedElementData.content}
                    onChange={(e) => updateElement(selectedElement, { content: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Kích thước: {selectedElementData.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={selectedElementData.fontSize}
                    onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Font:
                  </label>
                  <select
                    value={selectedElementData.fontFamily}
                    onChange={(e) => updateElement(selectedElement, { fontFamily: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                    Màu chữ:
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '6px',
                    marginBottom: '10px'
                  }}>
                    {[
                      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
                      '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
                    ].map((color) => (
                      <div
                        key={color}
                        onClick={() => updateElement(selectedElement, { color })}
                        style={{
                          width: '25px',
                          height: '25px',
                          backgroundColor: color,
                          border: selectedElementData.color === color ? '2px solid #3498db' : '1px solid #bdc3c7',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={selectedElementData.color}
                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    style={{
                      width: '100%',
                      height: '30px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => updateElement(selectedElement, {
                      fontWeight: selectedElementData.fontWeight === 'bold' ? 'normal' : 'bold'
                    })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: selectedElementData.fontWeight === 'bold' ? '#3498db' : '#7f8c8d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    B
                  </button>
                  <button
                    onClick={() => updateElement(selectedElement, {
                      fontStyle: selectedElementData.fontStyle === 'italic' ? 'normal' : 'italic'
                    })}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: selectedElementData.fontStyle === 'italic' ? '#3498db' : '#7f8c8d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}
                  >
                    I
                  </button>
                </div>
              </div>
            )}

            {selectedElementData.type === 'decoration' && (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Tên: {selectedElementData.name}
                  </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Kích thước: {selectedElementData.width}px
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={selectedElementData.width}
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      updateElement(selectedElement, { width: newSize, height: newSize });
                    }}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                    Màu trang trí:
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '6px',
                    marginBottom: '10px'
                  }}>
                    {[
                      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
                      '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
                    ].map((color) => (
                      <div
                        key={color}
                        onClick={() => updateElement(selectedElement, { color })}
                        style={{
                          width: '25px',
                          height: '25px',
                          backgroundColor: color,
                          border: selectedElementData.color === color ? '2px solid #3498db' : '1px solid #bdc3c7',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={selectedElementData.color}
                    onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    style={{
                      width: '100%',
                      height: '30px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            )}

            {selectedElementData.type === 'image' && (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Chiều rộng: {selectedElementData.width}px
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={selectedElementData.width}
                    onChange={(e) => updateElement(selectedElement, { width: parseInt(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    Chiều cao: {selectedElementData.height}px
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={selectedElementData.height}
                    onChange={(e) => updateElement(selectedElement, { height: parseInt(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                Xoay: {selectedElementData.rotation}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={selectedElementData.rotation}
                onChange={(e) => updateElement(selectedElement, { rotation: parseInt(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <button
              onClick={() => deleteElement(selectedElement)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '10px'
              }}
            >
              Xóa Element
            </button>
          </div>
        )}
      </div>

      {/* Main canvas area */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div
          ref={canvasRef}
          style={{
            position: 'relative',
            width: '400px',
            height: '500px',
            backgroundColor: tshirtColor,
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            cursor: 'default',
            clipPath: 'polygon(25% 8%, 75% 8%, 85% 15%, 85% 25%, 95% 30%, 95% 100%, 5% 100%, 5% 30%, 15% 25%, 15% 15%)'
          }}
          onClick={() => setSelectedElement(null)}
        >
          {/* Elements */}
          {elements.map((element) => (
            <div
              key={element.id}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
              style={{
                position: 'absolute',
                left: element.x,
                top: element.y,
                cursor: 'move',
                transform: `rotate(${element.rotation}deg)`,
                transformOrigin: 'center',
                border: selectedElement === element.id ? '2px dashed #3498db' : '2px solid transparent',
                userSelect: 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element.id);
              }}
            >
              {element.type === 'text' ? (
                <span style={{
                  fontSize: `${element.fontSize}px`,
                  fontFamily: element.fontFamily,
                  color: element.color,
                  fontWeight: element.fontWeight,
                  fontStyle: element.fontStyle,
                  whiteSpace: 'nowrap',
                  display: 'block',
                  padding: '4px'
                }}>
                  {element.content}
                </span>
              ) : element.type === 'decoration' ? (
                <div
                  style={{
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    color: element.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: element.svg.replace('viewBox="0 0 24 24"', `viewBox="0 0 24 24" width="${element.width}" height="${element.height}"`)
                  }}
                />
              ) : (
                <img
                  src={element.src}
                  alt="Design element"
                  style={{
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TShirtDesigner;