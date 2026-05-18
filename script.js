const itemName = document.getElementById('itemName');
const itemStock = document.getElementById('itemStock');
const itemUnit = document.getElementById('itemUnit');
const itemPrice = document.getElementById('itemPrice');

async function tambahBarang() {
    if (itemName.value !== '') {
        const response = await fetch('http://localhost:3000/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Date.now,
                namaBarang: itemName.value,
                stok: itemStock.value,
                satuan: itemUnit.value,
                harga: itemPrice.value,
                total: itemStock.value * itemPrice.value
            })
        });
        const hasil = response.json();
        alert(`berhasil menambahkan data`);
        await generateData();
    } else {
        alert('Nama barang tidak boleh kosong');
    }
}

async function generateBarang() {
    try {
        const response = await fetch('http://localhost:3000/api/data');
        const results = await response.json();

        const output = document.getElementById('inventory-table-body');
        output.innerHTML = '';
        results.forEach(d => {
            const tr = document.createElement('tr');
            tr.classList.add('hover:bg-gray-50/70', 'transition');
            tr.innerHTML = `<td class="p-4 font-medium text-gray-800">${d.namaBarang}</td>
                                <td class="p-4 text-center">
                                    <span class="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-xs border border-amber-200">
                                        <span>${d.stok}</span> <span>${d.satuan}</span>
                                    </span>
                                </td>
                                <td class="p-4 text-gray-600 flex justify-between"><span>Rp.</span><span>${d.harga.toLocaleString('id-ID')}</span></td>
                                <td class="p-4 text-center">
                                    <span class="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-xs border border-amber-200">
                                        <span>${d.total.toLocaleString('id-ID')}</span>
                                </td>
                                <td class="p-4 text-right space-x-1">
                                    <button class="px-2.5 py-1.5 bg-sky-50 text-sky-600 font-semibold rounded-lg text-xs hover:bg-sky-100 transition">Kurangi 1</button>
                                    <button class="px-2.5 py-1.5 bg-red-50 text-red-600 font-semibold rounded-lg text-xs hover:bg-red-100 transition" onclick = "deleteProduk(${d.id})">&times;</button>
                                </td>`;
            output.appendChild(tr);
            sumBarang();
            hitungEstimasi();
            hitungStokMenipis();
            sumBarang();
        });
    } catch (error) {
        console.log(`tidak bisa memunculkan data ${error}`)
    }
}

async function deleteProduk(id) {
    if (confirm('Apakah anda ingin menghapus product tersebut?')) {
        try {
            const results = await fetch(`http://localhost:3000/api/data/${id}`, {
                method: 'DELETE'
            });
            if (!results.ok) {
                const errorData = await results.json();
                throw new Error(errorData.message || 'Gagal menghapus');
            }

            const hasil = await results.json();
            console.log(hasil.message);
            await generateBarang();
        } catch (error) {
            console.log('gagal menghapus data', error);
            alert(error.message);
        }
    }
}

const totalBarang = document.getElementById('stat-total-items');
const itemCounter = document.getElementById('item-counter');
const sumBarang = async function () {
    const response = await fetch('http://localhost:3000/api/data')
    const hasil = await response.json();
    totalBarang.innerText = hasil.length;
    itemCounter.innerText = hasil.length;
}

const lowStock = document.getElementById('stat-low-stock')
const hitungStokMenipis = async function () {
    const response = await fetch('http://localhost:3000/api/data');
    let hasil = await response.json();
    hasil = hasil.filter(d => d.stok <= 10);
    lowStock.innerText = hasil.length;

}

const estimasiAsset = document.getElementById('stat-total-value')
const hitungEstimasi = async function () {
    const response = await fetch('http://localhost:3000/api/data');
    const hasil = await response.json();
    let sumAsset = hasil.map(p => p.total);
    estimasiAsset.innerText = `Rp ${sumAsset.reduce((a, b) => a + b, 0).toLocaleString('id-ID')}`;
}

generateBarang();