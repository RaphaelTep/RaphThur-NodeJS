import * as http from "http";
import { URL } from "url";

export let contacts = [
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

export const server = http.createServer((req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  const regexId = /\/todos\/[0-9]+/g;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route: GET /todos
  if (method === "GET" && pathname === "/contacts") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(contacts));
  } else if (method === "POST" && pathname === "/contacts") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const newContact = JSON.parse(body);
        if (
          typeof newContact.firstName !== "string" ||
          typeof newContact.lastName !== "string" ||
          typeof newContact.title !== "string"
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON structure" }));
          return;
        }
        newContact.id =
          contacts.length > 0 ? Math.max(...contacts.map((t) => t.id)) + 1 : 1;
        contacts.push(newContact);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newContact));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else if (method === "PUT" && /\/contacts\/[0-9]+/g.test(pathname)) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const newContact = JSON.parse(body);
        const contactId = Number(pathname.match(/[0-9]+/g)[0]);
        if (
          typeof newContact.firstName !== "string" ||
          typeof newContact.lastName !== "string" ||
          typeof newContact.title !== "string"
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON structure" }));
          return;
        }
        newContact.id = contactId;
        for (var contact in contacts) {
          if (contacts[contact].id == contactId) {
            contacts[contact] = newContact;
          }
        }
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newContact));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  }

  // else if (method === 'PATCH' && /\/contacts\/[0-9]+/g.test(pathname)) {
  //   let body = '';
  //   req.on('data', chunk => {
  //     body += chunk.toString();
  //   });

  //   req.on('end', () => {
  //     try {
  //       const contactModified = JSON.parse(body);
  //       const contactId = Number(pathname.match(/[0-9]+/g)[0])

  //       if(
  //         typeof contactModified.firstName !== "string" ||
  //         typeof contactModified.lastName !== "string" ||
  //         typeof contactModified.title !== "string"
  //       ){
  //         res.writeHead(400, { 'Content-Type': 'application/json' });
  //         res.end(JSON.stringify({ error: 'Invalid JSON structure' }));
  //         return;
  //       }

  //       if(typeof new)

  //       newContact.id = contactId
  //       for(var contact in contacts){
  //         if(contacts[contact].id == contactId){
  //           contacts[contact] = newContact
  //         }
  //       }
  //       res.writeHead(201, { 'Content-Type': 'application/json' });
  //       res.end(JSON.stringify(newContact));
  //     } catch (error) {
  //       res.writeHead(400, { 'Content-Type': 'application/json' });
  //       res.end(JSON.stringify({ error: 'Invalid JSON' }));
  //     }
  //   });
  // }
  else if (method === "DELETE" && /\/contacts\/[0-9]+/g.test(pathname)) {
    contacts = contacts.filter(
      (item) => !(item.id === Number(pathname.match(/[0-9]+/g)[0])),
    );
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "success", elements: contacts }));
  } else {
    res.writeHead(404);
    res.end();
    return;
  }
});
