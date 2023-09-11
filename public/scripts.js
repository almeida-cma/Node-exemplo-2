document.getElementById("cadastro-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let celular = document.getElementById("celular").value;

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            celular: celular
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            displayCadastros();
            
            // Limpar o formulário após o cadastro
            document.getElementById("cadastro-form").reset();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function displayCadastros() {
    fetch('/cadastro')
    .then(response => response.json())
    .then(data => {
        let tableBody = '';
        data.forEach(cadastro => {
            tableBody += `
            <tr>
                <td>${cadastro.nome}</td>
                <td>${cadastro.email}</td>
                <td>${cadastro.celular}</td>
                <td>
                    <button onclick="editCadastro('${cadastro.id}', '${cadastro.nome}', '${cadastro.email}', '${cadastro.celular}')">Editar</button>
                    <button onclick="deleteCadastro(${cadastro.id})">Delete</button>
                </td>
            </tr>`;
        });
        document.getElementById("cadastro-lista").innerHTML = tableBody;
    });
}

function deleteCadastro(id) {
    fetch(`/cadastro/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            displayCadastros();
        }
    });
}

// Iniciar a lista de cadastros ao carregar a página:
displayCadastros();

// Máscara para o campo celular
document.getElementById("celular").addEventListener("input", function() {
    let value = this.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (value.length <= 10) {
        this.value = value.replace(/(\d{2})(\d{0,4})(\d{0,4})/, '($1) $2-$3');
    } else {
        this.value = value.replace(/(\d{2})(\d{0,5})(\d{0,4})/, '($1) $2-$3');
    }
});

// Referências para o Modal
const editModal = document.getElementById("editModal");
const closeBtn = document.getElementsByClassName("close")[0];

// Mostrar o modal com os dados para edição
function editCadastro(id, nome, email, celular) {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-nome").value = nome;
    document.getElementById("edit-email").value = email;
    document.getElementById("edit-celular").value = celular;
    editModal.style.display = "block";
}

// Atualizar os dados após editar
document.getElementById("edit-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let id = document.getElementById("edit-id").value;
    let nome = document.getElementById("edit-nome").value;
    let email = document.getElementById("edit-email").value;
    let celular = document.getElementById("edit-celular").value;

    fetch(`/cadastro/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            celular: celular
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            displayCadastros();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    editModal.style.display = "none";
});

// Fechar o modal
closeBtn.onclick = function() {
    editModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
}
