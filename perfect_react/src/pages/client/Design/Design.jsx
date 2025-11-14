// src/pages/client/Design/Design.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import designService from '../../../services/designService.js';

// ====== IMPORT ẢNH ÁO (đặt trong src/data) ======
import shirt1 from '../../../data/1a.png';
import shirt2 from '../../../data/2a.png';
import shirt3 from '../../../data/3a.png';
import shirt5 from '../../../data/5a.png';
import shirt7 from '../../../data/7a.png';

const TShirtDesigner = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [dragData, setDragData] = useState(null);
  const canvasRef = useRef(null);

  // user inputs for saving
  const [name, setName] = useState('Áo của tôi');
  const [description, setDescription] = useState('Tạo bằng TShirtDesigner');
  const [price, setPrice] = useState(''); // string to send as BigDecimal

  // ===== DANH SÁCH ẢNH ÁO =====
  const baseImages = [
    { src: shirt1, label: 'Mẫu 1' },
    { src: shirt2, label: 'Mẫu 2' },
    { src: shirt3, label: 'Mẫu 3' },
    { src: shirt5, label: 'Mẫu 5' },
    { src: shirt7, label: 'Mẫu 7' },
  ];
  const [baseIndex, setBaseIndex] = useState(0);

  // thumbs
  const thumbsRef = useRef(null);
  const scrollByAmount = 140;
  const scrollLeft = () => thumbsRef.current?.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
  const scrollRight = () => thumbsRef.current?.scrollBy({ left:  scrollByAmount, behavior: 'smooth' });

  // decorations
  const decorationImages = [
    { id: 'star', name: 'Ngôi sao', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
    { id: 'heart', name: 'Trái tim', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
    { id: 'music', name: 'Nốt nhạc', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>' },
  ];

  // CRUD element functions
  const addTextElement = () => {
    const el = { id: nextId, type: 'text', content: 'Sample Text', x: 150, y: 200,
      fontSize: 24, fontFamily: 'Arial', color: '#000', fontWeight: 'normal', fontStyle: 'normal', rotation: 0 };
    setElements(p => [...p, el]);
    setSelectedElement(el.id);
    setNextId(p => p + 1);
  };

  const addImageElement = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const el = { id: nextId, type: 'image', src: ev.target.result, x: 150, y: 150, width: 100, height: 100, rotation: 0 };
        setElements(p => [...p, el]);
        setSelectedElement(el.id);
        setNextId(p => p + 1);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const addDecorationElement = (d) => {
    const el = { id: nextId, type: 'decoration', svg: d.svg, name: d.name, x: 150, y: 150, width: 60, height: 60, color: '#000', rotation: 0 };
    setElements(p => [...p, el]);
    setSelectedElement(el.id);
    setNextId(p => p + 1);
  };

  const updateElement = (id, updates) => setElements(p => p.map(el => el.id === id ? { ...el, ...updates } : el));
  const deleteElement = (id) => { setElements(p => p.filter(el => el.id !== id)); if (selectedElement === id) setSelectedElement(null); };

  // Drag handlers
  const handleMouseDown = useCallback((e, elementId) => {
    e.preventDefault();
    setSelectedElement(elementId);
    const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return;
    const el = elements.find(x => x.id === elementId); if (!el) return;
    setDragData({ elementId, startX: e.clientX - rect.left - el.x, startY: e.clientY - rect.top - el.y });
  }, [elements]);

  const handleMouseMove = useCallback((e) => {
    if (!dragData) return;
    const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return;
    const newX = e.clientX - rect.left - dragData.startX;
    const newY = e.clientY - rect.top - dragData.startY;
    updateElement(dragData.elementId, { x: newX, y: newY });
  }, [dragData]);

  const handleMouseUp = useCallback(() => setDragData(null), []);
  useEffect(() => {
    if (!dragData) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
  }, [dragData, handleMouseMove, handleMouseUp]);

  // Download PNG (existing)
  const downloadDesign = async () => {
    const node = canvasRef.current;
    if (!node) return;

    const prevSelected = selectedElement;
    setSelectedElement(null);
    node.classList.add('exporting');
    await new Promise(r => setTimeout(r, 0));

    const rect = node.getBoundingClientRect();
    const fullW = Math.round(rect.width);
    const fullH = Math.round(rect.height);
    const slimFactor = 0.96;
    const shotW = Math.round(fullW * slimFactor);
    const shotH = fullH;
    const offsetX = Math.round((fullW - shotW) / 2);
    const offsetY = 0;
    const scale = Math.max(2, window.devicePixelRatio || 1);

    const canvas = await html2canvas(node, {
      backgroundColor: null,
      width: shotW,
      height: shotH,
      x: offsetX,
      y: offsetY,
      scale,
      useCORS: true,
      removeContainer: true,
      onclone: (doc) => {
        const style = doc.createElement('style');
        style.textContent = `
          .no-export { display: none !important; }
          [data-selected="true"] { border: 2px solid transparent !important; }
          .exporting { transform: none !important; }
        `;
        doc.head.appendChild(style);
      },
    });

    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `design_${baseImages[baseIndex]?.label?.replace(/\s+/g, '_') || 'shirt'}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    node.classList.remove('exporting');
    setSelectedElement(prevSelected);
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  // --- Export canvas to Blob helper (used for upload) ---
  const exportCanvasBlob = async (node) => {
    const canvas = await html2canvas(node, {
      backgroundColor: null,
      useCORS: true,
      scale: Math.max(2, window.devicePixelRatio || 1),
      onclone: (doc) => {
        const style = doc.createElement('style');
        style.textContent = `
          .no-export { display: none !important; }
          [data-selected="true"] { border: 2px solid transparent !important; }
          .exporting { transform: none !important; }
        `;
        doc.head.appendChild(style);
      }
    });
    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.92));
  };

  // ===== Save to server =====
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  const saveDesignToServer = async () => {
    if (!canvasRef.current) return;
    setIsSaving(true);
    setSaveProgress(0);
    const node = canvasRef.current;
    const prevSelected = selectedElement;
    try {
      // hide selection visuals
      setSelectedElement(null);
      node.classList.add('exporting');
      await new Promise(r => setTimeout(r, 50));

      // export to blob
      const blob = await exportCanvasBlob(node);
      if (!blob) throw new Error('Không tạo được ảnh từ canvas.');

      // build payload - match CreateCustomProductRequest DTO
      const payload = {
        name: (name && name.trim()) ? name.trim() : `Thiết kế ${Date.now()}`,
        description: description || '',
        price: price ? String(price) : null,
        baseImage: baseImages[baseIndex]?.label || null,
        designJson: JSON.stringify(elements)
      };

      // call service
      const result = await designService.createCustomProductWithImage(payload, blob, {
        filename: `design_${Date.now()}.png`,
        onUploadProgress: (ev) => {
          if (ev && ev.loaded && ev.total) {
            setSaveProgress(Math.round((ev.loaded * 100) / ev.total));
          }
        }
      });

      console.log('Saved custom product:', result);
      alert('Lưu thiết kế thành công!');
      node.classList.remove('exporting');
      setSelectedElement(prevSelected);
      setIsSaving(false);
      setSaveProgress(100);
      return result;
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Lưu thất bại');
      node.classList.remove('exporting');
      setSelectedElement(prevSelected);
      setIsSaving(false);
      setSaveProgress(0);
      throw err;
    }
  };

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'Arial, sans-serif', background:'#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{ width:320, background:'#2c3e50', color:'#fff', padding:20, overflowY:'auto' }}>
        <h2 style={{ margin:'0 0 12px', fontSize:22 }}>T-Shirt Designer</h2>

        {/* Save metadata inputs */}
        {/* <div style={{ marginBottom:18 }}>
          <label style={{ display:'block', fontSize:13, marginBottom:6 }}>Tiêu đề</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} style={{ width:'100%', padding:8, borderRadius:6, border:'none', marginBottom:8 }} />

          <label style={{ display:'block', fontSize:13, marginBottom:6 }}>Mô tả</label>
          <input value={description} onChange={(e)=>setDescription(e.target.value)} style={{ width:'100%', padding:8, borderRadius:6, border:'none', marginBottom:8 }} />

          <label style={{ display:'block', fontSize:13, marginBottom:6 }}>Giá (VNĐ)</label>
          <input value={price} readOnly onChange={(e)=>setPrice(400000)} placeholder="400000" style={{ width:'100%', padding:8, borderRadius:6, border:'none' }} />
        </div> */}

        {/* Tools */}
        <div style={{ marginBottom:20 }}>
          <h3 style={{ margin:'0 0 12px', fontSize:16 }}>Công cụ</h3>
          <button onClick={addTextElement} style={btn('#3498db')}>+ Thêm Text</button>
          <button onClick={addImageElement} style={btn('#e74c3c')}>+ Thêm Hình ảnh</button>
          <button onClick={downloadDesign} style={btn('#16a34a')}>Tải ảnh về máy</button>

          {/* <button
            onClick={saveDesignToServer}
            style={{ ...btn('#8b5cf6'), marginTop: 8 }}
            disabled={isSaving}
          >
            {isSaving ? `Đang lưu... ${saveProgress}%` : 'Đặt hàng'}
          </button> */}
        </div>

        {/* Decoration */}
        <div style={{ marginBottom:30 }}>
          <h3 style={{ margin:'0 0 12px', fontSize:16 }}>Trang trí có sẵn</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {decorationImages.map((d) => (
              <div key={d.id}
                   onClick={()=>addDecorationElement(d)}
                   style={decItem()}
                   onMouseEnter={(e)=>{ e.currentTarget.style.backgroundColor='#3498db'; e.currentTarget.style.transform='scale(1.05)'; }}
                   onMouseLeave={(e)=>{ e.currentTarget.style.backgroundColor='#34495e'; e.currentTarget.style.transform='scale(1)'; }}
                   dangerouslySetInnerHTML={{ __html: d.svg.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="24" height="24"') }} />
            ))}
          </div>
        </div>

        {/* CHỌN ẢNH ÁO */}
        <div style={{ marginBottom:30 }}>
          <h3 style={{ margin:'0 0 12px', fontSize:16 }}>Chọn ảnh áo</h3>
          <div style={{ position:'relative' }}>
            <button
              className="no-export"
              data-html2canvas-ignore="true"
              onClick={scrollLeft}
              aria-label="Trước"
              style={arrowBtn('left')}
            >‹</button>

            <div
              ref={thumbsRef}
              style={{
                overflowX:'auto', whiteSpace:'nowrap', display:'flex', gap:10, padding:'8px 30px',
                borderRadius:10, background:'#1b2838', scrollbarWidth:'none', msOverflowStyle:'none'
              }}
              onWheel={(e)=>{ if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) thumbsRef.current.scrollLeft += e.deltaY; }}
            >
              <style>{`div::-webkit-scrollbar{ display:none; }`}</style>
              {baseImages.map((img, idx)=>( 
                <div key={img.src}
                     onClick={()=>setBaseIndex(idx)}
                     title={img.label}
                     style={{
                       width:70, height:88, borderRadius:8, overflow:'hidden', flex:'0 0 auto', cursor:'pointer',
                       border: baseIndex===idx ? '3px solid #60a5fa' : '2px solid #cbd5e1',
                       boxShadow: baseIndex===idx ? '0 0 0 4px rgba(96,165,250,.25)' : 'none',
                       background:'#fff'
                     }}>
                  <img src={img.src} alt={img.label} style={{ width:'100%', height:'100%', objectFit:'contain' }}/>
                </div>
              ))}
            </div>

            <button
              className="no-export"
              data-html2canvas-ignore="true"
              onClick={scrollRight}
              aria-label="Tiếp"
              style={arrowBtn('right')}
            >›</button>
          </div>
        </div>

        {/* Properties panel */}
        {selectedElementData && (
          <div>
            <h3 style={{ margin:'0 0 12px', fontSize:16 }}>
              Thuộc tính {selectedElementData.type==='text' ? 'Text' : selectedElementData.type==='decoration' ? 'Trang trí' : 'Hình ảnh'}
            </h3>

            {selectedElementData.type==='text' && (
              <div>
                <Labeled label="Nội dung:">
                  <input type="text" value={selectedElementData.content}
                         onChange={(e)=>updateElement(selectedElement, { content: e.target.value })} style={input()}/>
                </Labeled>
                <Labeled label={`Kích thước: ${selectedElementData.fontSize}px`}>
                  <input type="range" min="12" max="72" value={selectedElementData.fontSize}
                         onChange={(e)=>updateElement(selectedElement, { fontSize: parseInt(e.target.value) })} style={{ width:'100%' }}/>
                </Labeled>
                <Labeled label="Font:">
                  <select value={selectedElementData.fontFamily}
                          onChange={(e)=>updateElement(selectedElement, { fontFamily: e.target.value })} style={input()}>
                    <option>Arial</option><option>Times New Roman</option><option>Georgia</option><option>Verdana</option><option>Impact</option>
                  </select>
                </Labeled>
                <Labeled label="Màu chữ:">
                  <input type="color" value={selectedElementData.color}
                         onChange={(e)=>updateElement(selectedElement, { color: e.target.value })}
                         style={{ width:'100%', height:30, border:'none', borderRadius:4, cursor:'pointer' }}/>
                </Labeled>
                <div style={{ display:'flex', gap:10, marginBottom:15 }}>
                  <button onClick={()=>updateElement(selectedElement, { fontWeight: selectedElementData.fontWeight==='bold'?'normal':'bold' })} style={toggleBtn(selectedElementData.fontWeight==='bold')}>B</button>
                  <button onClick={()=>updateElement(selectedElement, { fontStyle: selectedElementData.fontStyle==='italic'?'normal':'italic' })} style={toggleBtn(selectedElementData.fontStyle==='italic', true)}>I</button>
                </div>
              </div>
            )}

            {selectedElementData.type==='decoration' && (
              <div>
                <p style={{ margin:'0 0 10px' }}>Tên: <b>{selectedElementData.name}</b></p>
                <Labeled label={`Kích thước: ${selectedElementData.width}px`}>
                  <input type="range" min="30" max="150" value={selectedElementData.width}
                         onChange={(e)=>{ const v=parseInt(e.target.value); updateElement(selectedElement, { width:v, height:v }); }}
                         style={{ width:'100%' }}/>
                </Labeled>
                <Labeled label="Màu:">
                  <input type="color" value={selectedElementData.color}
                         onChange={(e)=>updateElement(selectedElement, { color:e.target.value })}
                         style={{ width:'100%', height:30, border:'none', borderRadius:4, cursor:'pointer' }}/>
                </Labeled>
              </div>
            )}

            {selectedElementData.type==='image' && (
              <div>
                <Labeled label={`Chiều rộng: ${selectedElementData.width}px`}>
                  <input type="range" min="50" max="300" value={selectedElementData.width}
                         onChange={(e)=>updateElement(selectedElement, { width: parseInt(e.target.value) })} style={{ width:'100%' }}/>
                </Labeled>
                <Labeled label={`Chiều cao: ${selectedElementData.height}px`}>
                  <input type="range" min="50" max="300" value={selectedElementData.height}
                         onChange={(e)=>updateElement(selectedElement, { height: parseInt(e.target.value) })} style={{ width:'100%' }}/>
                </Labeled>
              </div>
            )}

            <Labeled label={`Xoay: ${selectedElementData.rotation}°`}>
              <input type="range" min="-180" max="180" value={selectedElementData.rotation}
                     onChange={(e)=>updateElement(selectedElement, { rotation: parseInt(e.target.value) })} style={{ width:'100%' }}/>
            </Labeled>

            <button onClick={()=>deleteElement(selectedElement)} style={btn('#e74c3c')}>Xóa Element</button>
          </div>
        )}
      </div>

      {/* CANVAS */}
      <div style={{ flex:1, display:'flex', justifyContent:'center', alignItems:'center', padding:20 }}>
        <div
          ref={canvasRef}
          style={{ position:'relative', width:400, height:500, borderRadius:20, boxShadow:'0 10px 30px rgba(0,0,0,.2)', overflow:'hidden', background:'#f0f0f0' }}
          onClick={()=>setSelectedElement(null)}
        >
          {/* Ảnh áo đang chọn */}
          <img
            src={baseImages[baseIndex].src}
            alt={baseImages[baseIndex].label}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'contain', pointerEvents:'none' }}
            draggable={false}
          />

          {/* Các element */}
          {elements.map((element) => (
            <div
              key={element.id}
              data-selected={selectedElement===element.id ? 'true' : 'false'}
              onMouseDown={(e)=>handleMouseDown(e, element.id)}
              style={{
                position:'absolute', left:element.x, top:element.y, cursor:'move',
                transform:`rotate(${element.rotation}deg)`, transformOrigin:'center',
                border: selectedElement===element.id ? '2px dashed #3498db' : '2px solid transparent',
                userSelect:'none'
              }}
              onClick={(e)=>{ e.stopPropagation(); setSelectedElement(element.id); }}
            >
              {element.type==='text' ? (
                <span style={{
                  fontSize:`${element.fontSize}px`, fontFamily:element.fontFamily,
                  color:element.color, fontWeight:element.fontWeight, fontStyle:element.fontStyle,
                  whiteSpace:'nowrap', display:'block', padding:4
                }}>{element.content}</span>
              ) : element.type==='decoration' ? (
                <div
                  style={{ width:element.width, height:element.height, color:element.color, display:'flex', alignItems:'center', justifyContent:'center' }}
                  dangerouslySetInnerHTML={{ __html: element.svg.replace('viewBox="0 0 24 24"', `viewBox="0 0 24 24" width="${element.width}" height="${element.height}"`) }}
                />
              ) : (
                <img src={element.src} alt="Design element"
                     style={{ width:element.width, height:element.height, objectFit:'contain', display:'block' }}
                     draggable={false}/>
              )}
            </div>
          ))}

          {/* mũi tên trên canvas */}
          <button
            className="no-export"
            data-html2canvas-ignore="true"
            onClick={()=>setBaseIndex(i => (i-1+baseImages.length)%baseImages.length)}
            style={canvasArrow('left')}
          >‹</button>

          <button
            className="no-export"
            data-html2canvas-ignore="true"
            onClick={()=>setBaseIndex(i => (i+1)%baseImages.length)}
            style={canvasArrow('right')}
          >›</button>
        </div>
      </div>
    </div>
  );
};

/* ===== Helpers ===== */
const Labeled = ({ label, children }) => (
  <div style={{ marginBottom:12 }}>
    <label style={{ display:'block', marginBottom:6, fontSize:14 }}>{label}</label>
    {children}
  </div>
);
const btn = (bg) => ({ width:'100%', padding:'12px', marginBottom:10, background:bg, color:'#fff', border:'none', borderRadius:5, cursor:'pointer', fontSize:14 });
const input = () => ({ width:'100%', padding:8, border:'none', borderRadius:4, fontSize:14 });
const toggleBtn = (active, italic=false) => ({
  flex:1, padding:8,
  backgroundColor: active ? '#3498db' : '#7f8c8d',
  color:'#fff', border:'none', borderRadius:4, cursor:'pointer', fontSize:14,
  fontWeight: italic ? 'normal' : 'bold', fontStyle: italic ? 'italic' : 'normal'
});
const decItem = () => ({ width:50, height:50, background:'#34495e', border:'2px solid #5a6c7d', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', transition:'all .2s' });
const arrowBtn = (side) => ({ position:'absolute', [side]:-6, top:'50%', transform:'translateY(-50%)', zIndex:2, width:28, height:28, borderRadius:999, border:'none', background:'#1f2937', color:'#fff', cursor:'pointer', boxShadow:'0 2px 6px rgba(0,0,0,.25)' });
const canvasArrow = (side) => ({ position:'absolute', top:'50%', transform:'translateY(-50%)', [side]:10, width:32, height:32, borderRadius:999, border:'none', background:'rgba(31,41,55,.85)', color:'#fff', cursor:'pointer' });

export default TShirtDesigner;
