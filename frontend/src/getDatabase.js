import neo4j from "neo4j-driver";

const NEO4J_URI = "bolt://localhost:7687";
const NEO4J_USERNAME = "neo4j";
const NEO4J_PASSWORD = "bioinsightpro";

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD), { encrypted: false });

// Fetch available databases
export const getDatabases = async () => {
  try {
    const session = driver.session();
    const result = await session.run("SHOW DATABASES;");
    await session.close();

    return result.records.map(record => record.get("name")).filter(name => name !== "system" && name !== "neo4j");
  } catch (error) {
    console.error("Error fetching databases:", error);
    return [];
  }
};

// Fetch graph data for the selected database
export const getGraphData = async (database) => {
  try {
    console.log(`Fetching graph data from database: ${database}`);
    const session = driver.session({ database });

    const query = `MATCH (n)-[r]->(m) RETURN n, r, m;`;
    const res = await session.run(query);
    await session.close();

    let nodesMap = new Map();
    let links = res.records.map((r) => {
      const sourceNode = r.get("n");
      const targetNode = r.get("m");

      const sourceId = sourceNode.identity.toString();
      const targetId = targetNode.identity.toString();

      if (!nodesMap.has(sourceId)) {
        nodesMap.set(sourceId, {
          id: sourceId,
          label: sourceNode.properties.id || sourceNode.labels[0] || `Node ${sourceId}`,
        });
      }
      if (!nodesMap.has(targetId)) {
        nodesMap.set(targetId, {
          id: targetId,
          label: targetNode.properties.id || targetNode.labels[0] || `Node ${targetId}`,
        });
      }

      return { source: sourceId, target: targetId };
    });

    let nodes = Array.from(nodesMap.values());
    return { nodes, links };
  } catch (error) {
    console.error("Neo4j Graph Data Fetch Error:", error);
    return { nodes: [], links: [] };
  }
};

// Close the Neo4j driver when needed
export const closeDriver = () => {
  driver.close();
};