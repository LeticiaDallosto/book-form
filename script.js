$(document).ready(function() {

/* FORMULÁRIO */

    $('#bookForm').submit(function(e) {
        e.preventDefault();

        const bookData = {
            userId: $('#userId').val(),
            id: $('#id').val(),
            title: $('#title').val(),
            body: $('#body').val()
        };

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            data: JSON.stringify(bookData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            success: function(response) {
                console.log('Livro cadastrado com sucesso:', response);
                alert('Livro cadastrado com sucesso!');
                // Limpar campos após o cadastro
                $('#titulo').val('');
                $('#descricao').val('');
            },
            error: function(error) {
                console.error('Erro ao cadastrar livro:', error);
            }
        });
    });

/* LISTA */

    // Configuração do Select2
    $('#filterTitle').select2({
        ajax: {
            url: 'https://jsonplaceholder.typicode.com/posts',
            dataType: 'json',
            processResults: function(data) {
                return {
                    results: $.map(data, function(item) {
                        console.log(data);
                        return { id: item.id, text: item.title };
                    })
                };
            }
        }
    });

    // Configuração do DataTable
    var bookTable = $('#bookTable').DataTable({
        ajax: {
            url: 'https://jsonplaceholder.typicode.com/posts',
            dataSrc: ''
        },
        columns: [
            { data: 'userId' },
            { data: 'id' },
            { data: 'title' },
            { data: 'body' },
            {
                data: null,
                render: function(data, type, row) {
                    return '<button class="btn-edit" data-id="' + row.id + '"><i class="fas fa-pencil-alt"></i></button>';
                }
            }
        ],
        searching: true
    });

    // Lógica de filtragem para cada coluna
    bookTable.columns().every(function () {
        var that = this;

        $('input', this.header()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that
                    .search(this.value)
                    .draw();
            }
        });
    });

    // Atualizar a DataTable com base no valor selecionado no campo de filtragem
    $('#filterTitle').on('select2:select', function (e) {
        bookTable.search($(this).val()).draw();
    });

    // Abrir o modal de edição e carregar os dados do livro
    $('#bookTable').on('click', '.btn-edit', function() {
        const bookId = $(this).data('id');
        const book = $('#bookTable').DataTable().row($(this).parents('tr')).data();
        if (book) {
            $('#editUserId').val(book.userId);
            $('#editId').val(book.id);
            $('#editTitle').val(book.title);
            $('#editBody').val(book.body);
            $('#editBookModal').modal('show');
        }
    });

});

// Salvar informações editadas do livro 
function saveChanges() {
    const userId = $('#editUserId').val();
    const id = $('#editId').val();
    const title = $('#editTitle').val();
    const body = $('#editBody').val();

    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts/' + id,
        method: 'PUT', // Utilizando o método PUT para atualizar o recurso
        data: JSON.stringify({ userId: userId, id: id, title: title, body: body }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        success: function(response) {
            console.log('Informações do livro atualizadas com sucesso:', response);
            alert('Informações do livro atualizadas com sucesso!');
            $('#editBookModal').modal('hide');
            // Limpar campos após o salvamento
            $('#editUserId').val('');
            $('#editId').val('');
            $('#editTitle').val('');
            $('#editBody').val('');
            // Atualizar a tabela (se necessário)
            $('#bookTable').DataTable().ajax.reload();
        },
        error: function(error) {
            console.error('Erro ao atualizar informações do livro:', error);
        }
    });
}

