import { StateGraph, messagesStateReducer } from "@langchain/langgraph";
import { createResumeReviewChain } from "@/chains/resumeReviewChain";

/*
A minimal graph with a single node that runs the review chain.
The graph is useful if you later add nodes (e.g., parser, ranker, ATS-scoring).
*/

function createNodes() {
  const reviewNode = async (state) => {
    const { resumeText, jobDescription } = state;
    const chain = createResumeReviewChain();
    const response = await chain.invoke({ resumeText, jobDescription });

    // For plain text models, response may be a string or object with .content
    const content = typeof response === "string" ? response : response?.content;

    return { ...state, reviewText: content };
  };

  return { reviewNode };
}

export function createResumeReviewGraph() {
  const nodes = createNodes();

  const graph = new StateGraph({
    channels: {
      // Keep it simple for now; extend later if you add more nodes
      resumeText: null,
      jobDescription: null,
      reviewText: null,
      messages: messagesStateReducer(),
    },
  })
    .addNode("review", nodes.reviewNode)
    .addEdge("__start__", "review")
    .addEdge("review", "__end__");

  return graph.compile();
}
