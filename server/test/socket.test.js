const {createServer} = require("http")
const ioServer = require("socket.io")
const socketHandler = require("../socket")
const Client = require("socket.io-client") 

jest.mock("../models/room")
jest.mock("../models/messages")
jest.mock("../models/user")

let clientSocket, io, httpServer;

beforeAll((done)=>{
    httpServer = createServer();
    io = new ioServer.Server(httpServer) 
    socketHandler(io)
    httpServer.listen(()=>{
        const port = httpServer.address().port
        clientSocket = new Client(`http://localhost:${port}`)
        clientSocket.on("connect",done)
    })
})

afterAll(()=>{
    io.close()
    clientSocket.close()
})

test("client should connect to the server", (done)=>{
    expect(clientSocket.connected).toBe(true)
    done()
})