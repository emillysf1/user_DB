import express from 'express';
import mysql from 'mysql2/promise';

const port = 3000;
const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "user_db",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


app.post('/users', async (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const apelido = req.body.apelido ?? null;

try {
    const result = await pool.query(
        "INSERT INTO user (nome, email, cpf, apelido) VALUES (?, ?, ?, ?)",
        [nome, email, cpf, apelido]
    );
    res.status(201).json({ msg: "Usuário criado com sucesso" });
} catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ msg: "Erro ao criar usuário" });
}})

app.get('/users', async(req, res) => {
    try{
        const rows = await pool.query('SELECT * FROM user;');
        res.status(200).json(rows[0]);
    }
    catch(erro){
        console.error("Erro so listar usuários");
        res.status(500).json({msg: "Erro ao listar usuários"})
    }
})


app.delete('/users/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const rows = await pool.query('DELETE FROM user WHERE id = ?;',[id]
    );
    if(rows[0].affectedRows == 0){
        throw new Error("Erro ao deletar usuário")
    }
    res.status(200).json({msg: "Usuario deletado com sucesso!"})
    }catch(erro){
        console.error("Erro ao deletar usuários");
        res.status(500).json({msg: "Erro ao deletar usuários"})
    }
})



app.put('/users/:id', async (req, res) => { 
    try{
        const id = req.params.id;
        const nome = req.body.nome;
        const email = req.body.email;
        const cpf = req.body.cpf;
        const apelido = req.body.apelido ?? null;

        
        const rows = await pool.query(
            "UPDATE user SET nome = ?, email = ?, cpf = ?, apelido = ? WHERE id = ?;",
            [nome, email, cpf, apelido, id]
        );
        res.status(200).json({msg: "Usuário atualizado com sucesso"})
    } 
    
    
    
    catch(erro){
        console.error("Erro ao atualizar usuários");
        res.status(500).json({msg: "Erro ao atualizar usuários"})
    }
})


app.listen(port, () => {
    console.log("Servidor rodando na porta " + port)
})
