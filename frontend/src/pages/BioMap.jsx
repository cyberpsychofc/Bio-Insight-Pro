import React, { useEffect, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Footer from "../components/Footer";
import DatabaseTabs from "../components/DatabaseTabs";
import { getGraphData } from "../getDatabase.js";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import { relFound } from "./Similarity.jsx";

export default function BioMap() {
  const graphRef = useRef(null);
  const graphInstance = useRef(null);
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDatabase) {
      loadData(selectedDatabase);
    }
  }, [selectedDatabase]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!relFound) {
      navigate('/');
    }
  }, [relFound]);

  useEffect(() => {
    const handleResize = () => {
      if (graphInstance.current && graphRef.current) {
        const { width, height } = graphRef.current.getBoundingClientRect();
        graphInstance.current.width(width).height(height);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size setup

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function loadData(database) {
    const { nodes, links } = await getGraphData(database);

    if (graphRef.current) {
      if (!graphInstance.current) {
        const { width, height } = graphRef.current.getBoundingClientRect();
        graphInstance.current = ForceGraph3D()(graphRef.current)
          .backgroundColor("#000000")
          .width(width)
          .height(height);

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
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>BioMap | BioInsightPro</title>
      </Helmet>
        <DatabaseTabs onSelectDatabase={setSelectedDatabase} />
      <div className="flex-grow w-full">
        <div
          ref={graphRef}
          className="w-full h-[calc(100vh-120px)] md:h-[calc(100vh-100px)]"
        />
      </div>
      <Footer />
    </div>
  );
}