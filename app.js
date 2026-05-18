const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

let arr = [];

app.get('/api/data', (req, res) => {
    res.json(arr);
});

app.post('/api/data', (req, res) => {
    if (arr) {
        const objectBaru = {
            id: req.body.id,
            namaBarang: req.body.namaBarang,
            stok: req.body.stok,
            satuan: req.body.satuan,
            harga: req.body.harga,
            total: req.body.total
        }
        arr.push(objectBaru);
        res.status(201).json({ message: 'data berhasil ditambahkan', data: arr })
    } else {
        res.status(400).json({ message: 'data gagal ditambahkan' })
    }
});

app.delete('/api/data/:id', (req, res) => {
    const idYangDicari = Number(req.params.id);
    const itemExist = arr.some(p => p.id === idYangDicari);

    if (!itemExist) {
        return res.status(404).json({ message: 'produk tidak ditemukan' });
    }

    arr = arr.filter(p => p.id !== idYangDicari);
    res.json({ message: 'produk berhasil dihapus' })
})

app.listen(port, () => {
    console.log(`server berjalan di http://localhost:${port}`)
})

