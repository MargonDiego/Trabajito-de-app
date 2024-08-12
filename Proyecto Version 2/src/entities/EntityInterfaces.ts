export interface IClass {
  id: number;
  name: string;
  students: IStudent[];
}

export interface IStudent {
  id: number;
  firstName: string;
  lastName: string;
  currentClass: IClass;
}

export interface IIntervention {
  id: number;
  // ... otras propiedades
}

export interface IAcademicRecord {
  id: number;
  // ... otras propiedades
}

// ... otras interfaces si son necesarias