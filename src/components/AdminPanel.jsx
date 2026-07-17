import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import { getPedidos, updatePedido, deletePedido } from '../services/api';
import { FaEdit, FaTrash, FaSync } from 'react-icons/fa';

export default function AdminPanel() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ estado: '' });
  const [editId, setEditId] = useState(null);

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
