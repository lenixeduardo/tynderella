import csv
import json
import re
import time
import urllib.request
import urllib.error

# Lista original fornecida pelo usuário
DADOS_ORIGINAIS = [
    "52.371.155/0001-38", "59.695.075/0001-87", "44.807.406/0001-56", "49.304.153/0001-11",
    "40.589.613/0001-20", "34.309.268/0001-21", "28.782.876/0001-56", "21.435.586/0001-97",
    "55.901.934/0001-96", "27.248.330/0002-38", "35.496.895/0001-81", "24.456.636/0001-00",
    "58.524.303/0001-93", "28.076.870/0001-63", "52.052.876/0001-85", "65.395.169/0001-33",
    "54.128.824/0001-70", "48.050.191/0001-22", "48.079.068/0001-34", "58.522.995/0001-30",
    "52.114.358/0001-49", "59.536.638/0001-94", "61.905.686/0001-54", "61.370.172/0001-41",
    "50.150.775/0001-11", "59.983.439/0001-24", "59.654.783/0001-70", "54.871.003/0001-20",
    "61.551.469/0001-03", "11.621.918/0001-74", "62.390.508/0001-09", "44.145.905/0002-06",
    "26.819.464/0001-18", "43.655.261/0002-33", "20.236.911/0001-20", "37.871.542/0001-40",
    "59.593.313/0001-43", "41.248.233/0001-95", "39.601.306/0001-39", "35.109.734/0001-98",
    "34.764.905/0001-50", "30.105.248/0002-69", "10.525.431/0001-25", "03.179.537/0001-59",
    "22.376.509/0001-76", "18.443.575/0001-44", "46.296.395/0001-12", "09.664.686/0001-90",
    "26.312.933/0001-08", "48.067.742/0001-60", "61.339.666/0001-63", "35.120.533/0002-72",
    "19.987.842/0001-07", "36.930.160/0003-49", "43.053.437/0001-04", "09.439.677/0001-03",
    "59.974.370/0001-72", "42.085.625/0001-43", "47.763.542/0001-80", "38.144.377/0001-97",
    "48.317.571/0001-80", "58.172.950/0001-83", "50.621.716/0001-84", "48.975.390/0001-41",
    "32.146.584/0001-02", "43.760.466/0001-06", "38.326.862/0001-81", "699.158.300-68",
    "31.716.463/0001-88", "839.642.150-15", "58.166.100/0001-72", "48.095.718/0001-35",
    "44.613.789/0001-21", "14.507.424/0001-51", "12.749.528/0001-47", "51.749.731/0001-75",
    "53.211.486/0001-73", "96.735.022/0004-11", "32.140.269/0001-60", "46.409.558/0001-26",
    "29.048.453/0001-70", "20.947.458/0012-12", "19.762.890/0001-05", "01.089.559/0001-00",
    "12.745.456/0001-60", "50.706.486/0001-56", "36.402.843/0001-61", "60.231.673/0001-84",
    "50.458.709/0001-03", "28.748.737/0001-06", "44.614.821/0001-93", "11.934.928/0003-21",
    "10.348.776/0001-50", "36.501.563/0001-00", "29.493.337/0001-60", "57.128.633/0001-05",
    "17.715.180/0001-90", "11.822.247/0001-00", "43.160.669/0001-53", "94.063.880/0001-99",
    "30.034.727/0002-31", "02.960.096/0001-65", "57.083.934/0001-51", "56.294.140/0001-74",
    "34.051.683/0001-28", "47.170.172/0001-77", "39.366.715/0001-06", "26.116.776/0001-65",
    "56.211.987/0001-48", "56.958.387/0001-48", "00.616.229/0001-55", "32.713.799/0001-50",
    "02.225.383/0001-21", "40.868.944/0001-08", "34.777.446/0001-49", "00.174.146/0001-53",
    "02.088.349/0001-52", "23.565.503/0001-00", "17.613.718/0001-56", "59.064.879/0001-88",
    "34.879.586/0001-28", "23.963.466/0001-98", "035.770.020-18", "44.752.790/0001-37",
    "022.132.350-31", "031.058.620-80", "40.024.125/0001-76", "49.787.866/0001-83",
    "18.202.116/0001-79", "030.770.580-30", "000.790.420-74", "40.953.083/0001-58",
    "51.563.044/0001-60", "021.295.530-60", "22.999.565/0001-67", "35.652.739/0001-62",
    "49.870.885/0001-79", "019.633.270-20", "47.522.052/0001-91", "23.705.152/0001-95",
    "61.173.765/0001-18", "50.617.924/0001-00", "845.841.220-91", "40.094.933/0001-00",
    "012.801.100-90", "048.391.850-42", "54.810.797/0001-11", "06.211.663/0001-31",
    "846.631.200-59", "16.823.725/0001-10", "48.876.523/0003-94", "34.755.838/0001-07",
    "34.679.298/0001-20", "30.532.141/0001-16", "50.491.369/0001-12", "44.627.028/0001-29",
    "57.734.904/0001-68", "52.586.552/0001-27", "07.045.298/0001-03", "01.151.735/0001-89",
    "18.946.748/0001-47", "03.025.075/0001-15", "07.095.800/0001-82", "26.443.354/0001-02",
    "42.858.587/0001-14", "52.083.978/0001-68", "320.521.462-53", "43.108.743/0001-92",
    "39.286.355/0001-24", "22.916.784/0001-35", "20.502.728/0001-29", "43.694.236/0001-88",
    "48.107.229/0001-56", "26.354.261/0001-01", "50.219.729/0001-21", "92.026.574/0001-57",
    "09.508.882/0001-75", "03.470.357/0001-21", "88.630.249/0001-21", "36.909.458/0001-05",
    "45.863.888/0001-24", "018.640.590-10", "52.785.579/0001-49", "93.054.880/0001-60",
    "40.607.833/0001-30", "36.173.814/0001-75", "59.864.486/0001-59", "60.479.892/0001-87",
    "29.594.394/0001-35"
]

def consultar_cnpj(cnpj_limpo):
    """Consulta dados do CNPJ na BrasilAPI."""
    url = f"https://brasilapi.com.br/api/cnpj/v1/{cnpj_limpo}"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                # BrasilAPI retorna o telefone no campo 'telefone' ou em formato ddd + telefone
                telefone = data.get("telefone") or ""
                razao_social = data.get("razao_social") or data.get("nome_fantasia") or "N/A"
                if not telefone:
                    # Tenta construir caso venha ddd e telefone separados
                    ddd = data.get("ddd") or ""
                    tel = data.get("telefone1") or data.get("telefone2") or ""
                    if ddd and tel:
                        telefone = f"({ddd}) {tel}"
                return {
                    "status": "Sucesso",
                    "razao_social": razao_social,
                    "telefone": telefone if telefone else "Não cadastrado"
                }
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return {"status": "Não Encontrado", "razao_social": "-", "telefone": "-"}
        elif e.code == 429:
            # Rate limit - retornaremos isso para que o loop saiba que deve esperar
            return {"status": "Rate Limit", "razao_social": "-", "telefone": "-"}
        else:
            return {"status": f"Erro HTTP {e.code}", "razao_social": "-", "telefone": "-"}
    except Exception as e:
        return {"status": f"Erro: {str(e)}", "razao_social": "-", "telefone": "-"}

def main():
    resultados = []
    
    print(f"Iniciando busca de telefones para {len(DADOS_ORIGINAIS)} registros...\n")
    print(f"{'Documento':<20} | {'Tipo':<6} | {'Status':<15} | {'Nome/Razão Social':<30} | {'Telefone'}")
    print("-" * 90)
    
    for doc in DADOS_ORIGINAIS:
        # Remove caracteres especiais
        doc_limpo = re.sub(r'\D', '', doc)
        
        if len(doc_limpo) == 11:
            # CPF
            info = {
                "documento_original": doc,
                "documento_limpo": doc_limpo,
                "tipo": "CPF",
                "status": "Não Permitido",
                "razao_social": "Pessoa Física (Sigilo LGPD)",
                "telefone": "Não consultável publicamente"
            }
            resultados.append(info)
            print(f"{doc:<20} | CPF    | Não Permitido   | {info['razao_social'][:28]:<30} | {info['telefone']}")
            
        elif len(doc_limpo) == 14:
            # CNPJ
            sucesso = False
            tentativas = 0
            while not sucesso and tentativas < 3:
                resultado_cnpj = consultar_cnpj(doc_limpo)
                if resultado_cnpj["status"] == "Rate Limit":
                    # Espera mais tempo se tomou rate limit
                    print(f"-> Rate Limit atingido ao buscar {doc}. Aguardando 10 segundos antes de tentar novamente...")
                    time.sleep(10)
                    tentativas += 1
                else:
                    info = {
                        "documento_original": doc,
                        "documento_limpo": doc_limpo,
                        "tipo": "CNPJ",
                        "status": resultado_cnpj["status"],
                        "razao_social": resultado_cnpj["razao_social"],
                        "telefone": resultado_cnpj["telefone"]
                    }
                    resultados.append(info)
                    print(f"{doc:<20} | CNPJ   | {info['status']:<15} | {info['razao_social'][:28]:<30} | {info['telefone']}")
                    sucesso = True
                    # Pequeno intervalo para respeitar a API e evitar 429
                    time.sleep(1.0)
            
            if not sucesso:
                # Caso falhe após todas as tentativas
                info = {
                    "documento_original": doc,
                    "documento_limpo": doc_limpo,
                    "tipo": "CNPJ",
                    "status": "Erro (Rate Limit)",
                    "razao_social": "-",
                    "telefone": "-"
                }
                resultados.append(info)
                print(f"{doc:<20} | CNPJ   | Falhou          | {'-':<30} | -")
        else:
            # Inválido
            info = {
                "documento_original": doc,
                "documento_limpo": doc_limpo,
                "tipo": "Inválido",
                "status": "Formato Inválido",
                "razao_social": "-",
                "telefone": "-"
            }
            resultados.append(info)
            print(f"{doc:<20} | Outro  | Inválido        | {'-':<30} | -")

    # Salva os resultados em formato CSV
    nome_arquivo = "resultado_telefones.csv"
    with open(nome_arquivo, mode="w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Documento Original", "Documento Limpo", "Tipo", "Status", "Nome/Razão Social", "Telefone"])
        for r in resultados:
            writer.writerow([r["documento_original"], r["documento_limpo"], r["tipo"], r["status"], r["razao_social"], r["telefone"]])
            
    print(f"\nBusca finalizada! Os resultados foram salvos no arquivo: '{nome_arquivo}'")

if __name__ == "__main__":
    main()
