export type User = {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
};

export const users: User[] = [
  { id: 'usr_1', name: 'Ana García', email: 'ana.garcia@example.com', registrationDate: '2024-05-10' },
  { id: 'usr_2', name: 'Luis Fernández', email: 'luis.f@example.com', registrationDate: '2024-06-15' },
  { id: 'usr_3', name: 'Sofía Martínez', email: 'sofia.m@example.com', registrationDate: '2024-06-20' },
  { id: 'usr_4', name: 'Carlos Rodríguez', email: 'carlos.r@example.com', registrationDate: '2024-07-01' },
  { id: 'usr_5', name: 'Laura Pérez', email: 'laura.p@example.com', registrationDate: '2024-07-05' },
];
