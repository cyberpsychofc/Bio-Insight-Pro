import React, { useEffect, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Footer from "../components/Footer";
import DatabaseTabs from "../components/DatabaseTabs";
import { getGraphData } from "../getDatabase.js";
import { Helmet } from "react-helmet";

export default function Services() {
  const graphRef = useRef(null);
  const graphInstance = useRef(null);
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (selectedDatabase) {
      loadData(selectedDatabase);
    }
  }, [selectedDatabase]);

  async function loadData(database) {
    const { nodes, links } = await getGraphData(database);

    if (graphRef.current) {
      if (!graphInstance.current) {
        graphInstance.current = ForceGraph3D()(graphRef.current)
          .backgroundColor("#000000").width(1800);

        // Add Bloom Effect
        const bloomPass = new UnrealBloomPass();
        bloomPass.strength = 4;
        bloomPass.radius = 1;
        bloomPass.threshold = 0;
        graphInstance.current.postProcessingComposer().addPass(bloomPass);
      }

      graphInstance.current.graphData({ nodes, links })
        .nodeAutoColorBy("id")
        .nodeLabel((node) => `${node.label}`)
        .linkDirectionalParticles(4)
        .linkDirectionalParticleSpeed(1);
    }
  }

  return (
    <>
      <Helmet>
        <title>
          BioMap | BioInsightPro
        </title>
      </Helmet>
      <DatabaseTabs onSelectDatabase={setSelectedDatabase} />
      <div className="grid justify-center w-auto">
        <div ref={graphRef} />
      </div>
      <Footer />
    </>
  );
}