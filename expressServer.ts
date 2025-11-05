import express from 'express';

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

server.get('/contacts', (req, res) => {
  res.json(contacts);
});

server.delete('/contacts/:contactId',(req,res) => {
  const index = contacts.findIndex((t) => t.id === parseInt(req.params.contactId))

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
    res.status(404).send({ error: 'Contact not found' });
  }
})

server.post('/contacts', (req, res) => {
  const body = req.body
  console.log(body)

  if (
    !body?.firstName ||
    !body?.lastName ||
    !body?.title
  ){
    res.status(400).send({ error: 'Missing required fields' });
    res.end();
    return;
  }

  console.log("Ici")

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

  if (index !== -1 && Number(req.params.contactId) < contacts.length) {
    contacts[index] = {
      id: Number(req.params.contactId),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      title: req.body.title,
    };
    res.status(201).json(contacts[index]);
  } else {
    res.status(404).send({ error: 'Contact not found' });
  }
})

server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

export { server, contacts };
