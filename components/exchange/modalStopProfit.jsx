import React, { useState, useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, onSubmit, children }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return; // Si el modal no existe, no continúes con el código

    const modalContent = document.querySelector('.modal-content-vcapital');
    if (!modalContent) return; // Si no se encuentra el contenido del modal, no continúes con el código

    let offsetX, offsetY;

    const handleMouseDown = (e) => {
      e.preventDefault();
      offsetX = e.clientX - modal.offsetLeft;
      offsetY = e.clientY - modal.offsetTop;

      const handleMouseMove = (e) => {
        e.preventDefault();
        modal.style.left = e.clientX - offsetX + 'px';
        modal.style.top = e.clientY - offsetY + 'px';
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    modalContent.addEventListener('mousedown', handleMouseDown);

    return () => {
      modalContent.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  if (!isOpen) {
    return null;
  }
  //   const [data, setData] = useState('');

  const handleChange = (event) => {
    const order = {
        price: event.target.value,
        type: '' 
    }
    // setData(order);
  };
  const handleSubmitProfit = () => {
    const order = {
        price: document.getElementById('price-order').value,
        type: 'profit'
    }
    console.log(order);
    if(order.price == '') return;
    if(order.price == 0) return;
    if(order.price < 0) return;
    onSubmit(order);
    // Restablecer los datos o cerrar el modal si es necesario
    // setData('');
    onClose();
  };
  const handleSubmitStop = () => {
    const order = {
        price: document.getElementById('price-order').value,
        type: 'stop'
    }
    console.log(order);
    if(order.price == '') return;
    if(order.price == 0) return;
    if(order.price < 0) return;
    onSubmit(order);
    // Restablecer los datos o cerrar el modal si es necesario
    // setData('');
    onClose();
  };

  return (
    <div ref={modalRef} className="modal-overlay-vcapital" id="myModalVcapital" 
        style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"}}>
      <div className="modal-content-vcapital" 
            style={{
                backgroundColor: "#363a45",
                padding: "4% 2.5%",
                borderRadius: "4px",
                width: "30%",
                position: "relative"
        }}>
        <span className="close" style={{ 
          position: "absolute", top: "4px", right: "15px", 
          cursor: "pointer", fontSize: "24px"}} onClick={onClose}>&times;</span>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <p style={{color: "#fff"}}>Price:</p>
          <input type="number" id="price-order" style={{
            marginLeft: "10px",
            width: "100%",
            border: "1px solid #aaaa",
            borderRadius: "2px",
            background: "#70707085",
            color: "white",
            fontSize: "12px",
            height: "20px"}}/>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "23px"
        }}>
          <button className="modal-submit" onClick={handleSubmitProfit} style={{
            width: "60px",
            height: "23px",
            color: "white",
            background: "#0ab20a",
            border: "0",
            borderRadius: "2px",
            fontSize: "10px",
            fontWeight: "600",
            cursor: "pointer"
            }}>
            PROFIT
          </button>
          <button className="modal-submit" onClick={handleSubmitStop} style={{
            width: "60px",
            height: "23px",
            color: "white",
            background: "#e21717",
            border: "0",
            borderRadius: "2px",
            fontSize: "10px",
            fontWeight: "600",
            cursor: "pointer"
            }}>
            STOP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
