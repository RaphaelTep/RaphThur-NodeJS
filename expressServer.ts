import express from 'express';
import logger from './logger';

const server = express();

server.use(express.json());

let contacts = [
  {
    id: 0,
    firstName: "Raphael",
    lastName: "TEP",
    title: "Femboy",
  },
  {
    id: 1,
    firstName: "ArthUwUr",
    lastName: "GayOwOt",
    title: "vroooooom",
  },
];

function isValidMethod(req: express.Request, res: express.Response, method: string) {
  if(req.method !== method){
    res.status(405).json({ error: 'Method not allowed' });
    res.end()
  }
}

server.get('/contacts', (req, res) => {

  isValidMethod(req, res, 'GET');

  logger.info(`Contact retrived : ${JSON.stringify(contacts)}`)
  res.json(contacts);
});

server.delete('/contacts/:contactId',(req,res) => {
  const index = contacts.findIndex((t) => t.id === parseInt(req.params.contactId))

  isValidMethod(req, res, 'DELETE')

  if (index !== -1) {
    contacts.splice(index, 1);

    if(contacts.length === 0){
      res.status(204);
      res.end();
    }

    res.status(200).send({
      elements: contacts,
      status: "success"
    });
  } else {
    logger.error(`Contact not found for id ${req.params.contactId}`)
    res.status(404).send({ error: 'Contact not found' });
  }
})

server.post('/contacts', (req, res) => {
  const body = req.body

  isValidMethod(req, res, 'POST')

  if (
    !body?.firstName ||
    !body?.lastName ||
    !body?.title
  ){
    logger.error(`Missing required fields for json ${JSON.stringify(body)}`)
    res.status(400).send({ error: 'Missing required fields' });
    res.end();
    return;
  }

  const newContact = {
    id: contacts.length,
    firstName: body.firstName,
    lastName: body.lastName,
    title: body.title,
  };

  contacts.push(newContact);
  res.status(201).json(newContact);
  res.end();
});

server.put('/contacts/:contactId',(req,res) => {
  const index = contacts.findIndex((t) => t.id === parseInt(req.params.contactId))

  const body = req.body

  isValidMethod(req, res, 'PUT')

  if (index !== -1 && Number(req.params.contactId) < contacts.length) {

    console.log((body?.title && typeof body?.title === 'string'))

    if(
      (body?.firstName && typeof body?.firstName === 'string') &&
      (body?.lastName && typeof body?.lastName === 'string') &&
      (body?.title && typeof body?.title === 'string')
    ){
      contacts[index] = {
        id: Number(req.params.contactId),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        title: req.body.title,
      };
      res.status(201).json(contacts[index]);
    }else {
      res.status(400).send({ error: 'Missing required fields or structure error' });
      res.end();
      return;
    }
  } else {
    res.status(404).send({ error: 'Contact not found' });
  }
})

server.patch('/contacts/:contactId', (req, res) => {
  const index = contacts.findIndex((t) => t.id === parseInt(req.params.contactId))

  const body = req.body

  isValidMethod(req, res, 'PATCH')

  if (index !== -1 && Number(req.params.contactId) < contacts.length) {
    if(
      body?.firstName && typeof body?.firstName === 'string'
    ){
      contacts[index] = {
        ...contacts[index]!,
        firstName: body.firstName,
      };
    }else if(
      body?.lastName && typeof body?.lastName === 'string'
    ){
      contacts[index] = {
        ...contacts[index]!,
        lastName: body.lastName,
      };
    }else if(
      body?.title && typeof body?.title === 'string'
    ){
      contacts[index] = {
        ...contacts[index]!,
        title: body.title,
      };
    }

    res.status(201).send(contacts[index]);
  } else {
    res.status(404).send({ error: 'Contact not found' });
  }
})

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

export { server, contacts };
