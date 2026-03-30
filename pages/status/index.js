import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Version />
      <MaxConnections />
      <OpenedConnections />
    </>
  );
}

function CondicionalRender({ isLoading, data, children }) {
  if (!isLoading && data) {
    return (
      <div>
        {children}: {data}
      </div>
    );
  }
}
function swrConfig() {
  return useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
}
function UpdatedAt() {
  const { isLoading, data } = swrConfig();

  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return CondicionalRender({
    isLoading,
    data: new Date(data.updated_at).toLocaleString(),
    children: "Última atualização",
  });
}

function Version() {
  const { isLoading, data } = swrConfig();
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return CondicionalRender({
    isLoading,
    data: data.dependencies.database.version,
    children: "Versão",
  });
}

function MaxConnections() {
  const { isLoading, data } = swrConfig();
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return CondicionalRender({
    isLoading,
    data: data.dependencies.database.max_connections,
    children: "Máximo de conexões",
  });
}

function OpenedConnections() {
  const { isLoading, data } = swrConfig();
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return CondicionalRender({
    isLoading,
    data: data.dependencies.database.opened_connections,
    children: "Conexões abertas",
  });
}
