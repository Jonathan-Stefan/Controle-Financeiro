from flask import Flask, render_template, request, redirect, url_for, jsonify
import requests
import os
import datetime

app = Flask(__name__)

# Definindo as variáveis de ambiente
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000/api/v1/conta")
API_DATABASE_RESET = os.getenv("API_DATABASE_RESET", "http://localhost:5000/api/v1/database/reset")

# Rota para a página inicial
@app.route('/')
def index():
    return render_template('index.html')

# Rota para exibir o formulário de cadastro
@app.route('/inserir', methods=['GET'])
def inserir_conta_form():
    return render_template('inserir.html')

# Função para atualizar conta
def atualizar_conta(conta_id, nome, valor, vencimento, status):
    payload = {
        'id': conta_id,
        'nome': nome,
        'valor': valor,
        'vencimento': vencimento,
        'status': status
    }
    response = requests.post(f"{API_BASE_URL}/atualizar", json=payload)
    return response

# Função para atualizar status das contas
def atualizar_status_contas():
    response = requests.get(f'{API_BASE_URL}/listar')
    if response.status_code == 200:
        contas = response.json()
        for conta in contas:
            vencimento = datetime.datetime.strptime(conta['vencimento'], '%d/%m/%Y').date()
            hoje = datetime.date.today()
            if vencimento < hoje and conta['status'] != 'paga':
                conta['status'] = 'vencida'
                atualizar_conta(conta['id'], conta['nome'], conta['valor'], conta['vencimento'], conta['status'])

# Rota para enviar os dados do formulário de cadastro para a API
@app.route('/inserir', methods=['POST'])
def inserir_conta():
    nome = request.form['nome']
    valor = request.form['valor']
    vencimento = request.form['vencimento']
    status = request.form['status']

    payload = {
        'nome': nome,
        'valor': valor,
        'vencimento': vencimento,
        'status': status
    }

    response = requests.post(f'{API_BASE_URL}/inserir', json=payload)
    
    if response.status_code == 201:
        return redirect(url_for('listar_contas'))
    else:
        return "Erro ao inserir conta", 500

# Rota para listar todas as contas
@app.route('/listar', methods=['GET'])
def listar_contas():

    # Primeiro, atualiza o status das contas
    atualizar_status_contas()
    
    response = requests.get(f'{API_BASE_URL}/listar')
    contas = response.json()
    
    total_valor = sum(float(conta['valor']) for conta in contas)
    total_pagas = sum(float(conta['valor']) for conta in contas if conta['status'] == 'paga')
    saldo_devedor = total_valor - total_pagas
    
    return render_template('listar.html', contas=contas, total_valor=total_valor, saldo_devedor=saldo_devedor)

# Rota para exibir o formulário de edição de conta
@app.route('/atualizar/<int:conta_id>', methods=['GET'])
def atualizar_conta_form(conta_id):
    response = requests.get(f"{API_BASE_URL}/listar")
    # filtrando apenas a conta correspondente ao ID
    contas = [conta for conta in response.json() if conta['id'] == conta_id]
    if len(contas) == 0:
        return "Conta não encontrada", 404
    conta = contas[0]
    return render_template('atualizar.html', conta=conta)

# Rota para enviar os dados do formulário de edição de conta para a API
@app.route('/atualizar/<int:conta_id>', methods=['POST'])
def atualizar_conta_route(conta_id):
    nome = request.form['nome']
    valor = request.form['valor']
    vencimento = request.form['vencimento']
    status = request.form['status']

    response = atualizar_conta(conta_id, nome, valor, vencimento, status)
    
    if response.status_code == 200:
        return redirect(url_for('listar_contas'))
    else:
        return "Erro ao atualizar conta", 500

# Rota para excluir uma conta
@app.route('/excluir/<int:conta_id>', methods=['POST'])
def excluir_conta(conta_id):
    payload = {'id': conta_id}

    response = requests.post(f"{API_BASE_URL}/excluir", json=payload)
    
    if response.status_code == 200:
        return redirect(url_for('listar_contas'))
    else:
        return "Erro ao excluir conta", 500

# Rota para resetar o banco de dados
@app.route('/reset-database', methods=['GET'])
def resetar_database():
    response = requests.delete(API_DATABASE_RESET)
    
    if response.status_code == 200:
        return redirect(url_for('index'))
    else:
        return "Erro ao resetar o banco de dados", 500

if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')
