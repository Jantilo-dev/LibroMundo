import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import { getPedidos, getPedido, updatePedido, deletePedido } from '../services/api';
import { FaEdit, FaTrash, FaSync, FaEye } from 'react-icons/fa';

export default function AdminPanel() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ estado: '' });
  const [editId, setEditId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { fetchPedidos() }, []);

  async function fetchPedidos() {
    try {
      setLoading(true);
      setError(null);
      const data = await getPedidos();
      setPedidos(Array.isArray(data.datos) ? data.datos : []);
    } catch (e) {
      setError('Error al cargar pedidos: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(pedido) {
    setEditId(pedido._id);
    setEditForm({ estado: pedido.estado });
    setShowEdit(true);
  }

  async function handleSave() {
    try {
      await updatePedido(editId, { estado: editForm.estado });
      setSuccess('Estado actualizado correctamente.');
      setShowEdit(false);
      setEditId(null);
      await fetchPedidos();
    } catch (e) {
      setError('Error al actualizar: ' + e.message);
    }
  }

  async function handleViewDetail(id) {
    try {
      setDetailLoading(true);
      const data = await getPedido(id);
      setDetailData(data.datos || data);
      setShowDetail(true);
    } catch (e) {
      setError('Error al cargar detalle: ' + e.message);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Eliminar este pedido?')) return;
    try {
      await deletePedido(id);
      setSuccess('Pedido eliminado.');
      await fetchPedidos();
    } catch (e) {
      setError('Error al eliminar: ' + e.message);
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">Panel Admin</h2>
        <Button variant="outline-primary" size="sm" onClick={fetchPedidos}>
          <FaSync className="me-1" /> Recargar
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <p className="text-center text-muted">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="text-center text-muted">No hay pedidos registrados.</p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover size="sm" className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Items</th>
                <th>Total</th>
                <th>Entrega</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th style={{ width: 100 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p._id}>
                  <td>{p.cliente?.nombre || '-'}</td>
                  <td>{p.cliente?.email || '-'}</td>
                  <td>{p.items?.length || 0}</td>
                  <td>${Number(p.total).toLocaleString('es-CL')}</td>
                  <td>{p.metodoEntrega || '-'}</td>
                  <td>
                    <Badge bg={p.estado === 'pendiente' ? 'warning' : p.estado === 'confirmado' ? 'success' : 'secondary'}>
                      {p.estado}
                    </Badge>
                  </td>
                  <td>{p.fecha || '-'}</td>
                  <td>
                    <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleViewDetail(p._id)}>
                      <FaEye />
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(p)}>
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <p className="text-center text-muted">Cargando detalle...</p>
          ) : detailData ? (
            <>
              <h6 className="fw-bold border-bottom pb-2">Cliente</h6>
              <p className="mb-1"><strong>Nombre:</strong> {detailData.cliente?.nombre || '-'}</p>
              <p className="mb-1"><strong>Email:</strong> {detailData.cliente?.email || '-'}</p>
              <p className="mb-3"><strong>Direccion:</strong> {detailData.cliente?.direccion || '-'}</p>

              <h6 className="fw-bold border-bottom pb-2">Items ({detailData.items?.length || 0})</h6>
              {detailData.items?.length > 0 ? (
                <Table size="sm" className="mb-3">
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.titulo}</td>
                        <td>${Number(item.precio).toLocaleString('es-CL')}</td>
                        <td>{item.cantidad}</td>
                        <td>${(Number(item.precio) * Number(item.cantidad)).toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted small mb-3">Sin items</p>
              )}

              <h6 className="fw-bold border-bottom pb-2">Resumen</h6>
              <p className="mb-1"><strong>Total:</strong> ${Number(detailData.total).toLocaleString('es-CL')}</p>
              <p className="mb-1"><strong>Metodo de entrega:</strong> {detailData.metodoEntrega || '-'}</p>
              <p className="mb-1"><strong>Estado:</strong> <Badge bg={detailData.estado === 'pendiente' ? 'warning' : 'success'}>{detailData.estado}</Badge></p>
              <p className="mb-0"><strong>Fecha:</strong> {detailData.fecha || '-'}</p>
            </>
          ) : (
            <p className="text-muted">No se encontro el pedido.</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar estado del pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select value={editForm.estado} onChange={e => setEditForm({ estado: e.target.value })}>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="enviado">Enviado</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
