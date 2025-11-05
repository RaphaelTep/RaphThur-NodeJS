import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { contacts, server } from './expressServer'; // Importe la liste des contacts
import { close } from 'express';

describe('GET contacts API', () => {
  // Réinitialise la liste des contacts avant chaque test
  beforeAll(() => {
    contacts.length = 0;
    contacts.push(
      { id: 0, firstName: "Raphael", lastName: "TEP", title: "Femboy" },
      { id: 1, firstName: "ArthUwUr", lastName: "GayOwOt", title: "vroooooom" }
    );
  });

  it('GET /contacts should return all contacts', async () => {
    const response = await request(server).get('/contacts');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(contacts);
  });
});

describe('POST contacts API', () => {
  // Réinitialise la liste des contacts avant chaque test
  beforeAll(() => {
    contacts.length = 0;
    contacts.push(
      { id: 0, firstName: "Raphael", lastName: "TEP", title: "Femboy" },
      { id: 1, firstName: "ArthUwUr", lastName: "GayOwOt", title: "vroooooom" }
    );
  });

  it('POST /contacts should add a new contact', async () => {
      const newContact = { firstName: "Romaric", lastName: "LeRaciste", title: "Dev Racisme" };
      const response = await request(server)
        .post('/contacts')
        .send(newContact);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe("Romaric");
      expect(contacts.some(c => c.firstName === "Romaric")).toBe(true);
    });
  it('POST /contacts should return 400 for invalid JSON', async () => {
    const response = await request(server)
      .post('/contacts')
      .send('{ "firstName": 123 }'); // JSON invalide
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});

describe('POST contacts API', () => {
  // Réinitialise la liste des contacts avant chaque test
  beforeAll(() => {
    contacts.length = 0;
    contacts.push(
      { id: 0, firstName: "Raphael", lastName: "TEP", title: "Femboy" },
      { id: 1, firstName: "ArthUwUr", lastName: "GayOwOt", title: "vroooooom" }
    );
  });

  it('PUT /contacts/:id should update a contact', async () => {
    const updatedContact = { firstName: "Jean", lastName: "Martin", title: "Senior Dev" };
    const response = await request(server)
      .put('/contacts/0')
      .send(updatedContact);
    expect(response.status).toBe(201);
    expect(response.body.firstName).toBe("Jean");
    expect(contacts[0].firstName).toBe("Jean");
  });
});


describe('DELETE contacts API', () => {
  // Réinitialise la liste des contacts avant chaque test
  beforeAll(() => {
    contacts.length = 0;
    contacts.push(
      { id: 0, firstName: "Raphael", lastName: "TEP", title: "Femboy" },
      { id: 1, firstName: "ArthUwUr", lastName: "GayOwOt", title: "vroooooom" }
    );
  });

  it('DELETE /contacts/:id should delete a contact', async () => {
    const response = await request(server)
      .delete('/contacts/0');
    expect(response.body).toEqual({
      elements: [
        { id: 1, firstName: "ArthUwUr", lastName: "GayOwOt", title: "vroooooom" }
      ],
      status: "success"
    });
    expect(response.status).toBe(200);
    expect(contacts.some(c => c.id === 0)).toBe(false);
  });

  it('DELETE /contacts/:id should return 204 if contact is empty', async () => {
    const response = await request(server)
      .delete('/contacts/1');
    expect(response.status).toBe(204);
    expect(contacts.some(c => c.id === 0)).toBe(false);
  });
});


describe('404 test pour contacts API', () => {
  // Réinitialise la liste des contacts avant chaque test
  beforeAll(() => {
    contacts.length = 0;
    contacts.push(
      { id: 0, firstName: "Raphael", lastName: "TEP", title: "Femboy" },
      { id: 1, firstName: "ArthUwUr", lastName: "GayOwOt", title: "vroooooom" }
    );
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(server).get('/unknown');
    expect(response.status).toBe(404);
  });
});
