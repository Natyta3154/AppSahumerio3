export type Order = {
  id: string;
  customerName: string;
  date: string;
  status: 'Pendiente' | 'Completado' | 'Cancelado';
  total: number;
};

export const orders: Order[] = [
  { id: '#3210', customerName: 'Ana García', date: '2024-07-22', status: 'Completado', total: 38.98 },
  { id: '#3209', customerName: 'Luis Fernández', date: '2024-07-21', status: 'Pendiente', total: 15.99 },
  { id: '#3208', customerName: 'Sofía Martínez', date: '2024-07-21', status: 'Completado', total: 29.99 },
  { id: '#3207', customerName: 'Carlos Rodríguez', date: '2024-07-20', status: 'Cancelado', total: 8.99 },
  { id: '#3206', customerName: 'Laura Pérez', date: '2024-07-19', status: 'Completado', total: 54.98 },
];
