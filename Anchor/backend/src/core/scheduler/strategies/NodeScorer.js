/**
 * NODE SCORING ENGINE
 * 
 * Implements a weighted scoring system similar to Kubernetes Scheduler.
 * Each strategy computes a score (0-100) for a node.
 * Final Score = Σ (StrategyScore * Weight)
 */

const STRATEGIES = {
    /**
     * RESOURCE FIT (Bin Packing vs Spreading)
     * currently implements BalancedResourceAllocation (spreading)
     */
    ResourceFit: (node, podSpec) => {
        const cpuReq = podSpec.resources?.requests?.cpu || 0;
        const ramReq = podSpec.resources?.requests?.memory || 0;

        // Normalize 0-100
        const cpuFree = 100 - (node.metrics?.cpuUsage || 0);
        const ramFree = 100 - (node.metrics?.ramUsage || 0);

        // If it doesn't fit, it's filtered out before scoring, 
        // effectively score 0 here means "barely fits", 100 means "lots of room"
        return (cpuFree + ramFree) / 2;
    },

    /**
     * IMAGE LOCALITY
     * Prefer nodes that already have the image to reduce startup time/bandwidth.
     */
    ImageLocality: (node, podSpec) => {
        const image = podSpec.containers?.[0]?.image;
        if (!image || !node.cachedImages) return 0;

        return node.cachedImages.includes(image) ? 100 : 0;
    },

    /**
     * AFFINITY
     * Label matching hard/soft constraints
     */
    NodeAffinity: (node, podSpec) => {
        const affinity = podSpec.affinity?.nodeAffinity?.preferredDuringSchedulingIgnoredDuringExecution;
        if (!affinity) return 0;

        let score = 0;
        for (const term of affinity) {
            const weight = term.weight || 1;
            const match = checkLabelMatch(node.labels, term.preference.matchExpressions);
            if (match) score += weight;
        }

        return Math.min(score, 100); // Cap at 100
    },

    /**
     * DATA LOCALITY
     * If pod needs a volume, schedule on node where volume exists (or is close)
     */
    DataLocality: (node, podSpec) => {
        // Placeholder for volume locality logic
        return 0; // Default off
    }
};

function checkLabelMatch(nodeLabels, expressions) {
    if (!nodeLabels || !expressions) return false;
    // ... Implementation of In, NotIn, Exists, DoesNotExist ...
    return true; // Simplified
}

class NodeScorer {
    constructor() {
        // Default weights
        this.weights = {
            ResourceFit: 1.0,
            ImageLocality: 0.5, // Nice to have, not critical
            NodeAffinity: 2.0,  // Very important if specified
            DataLocality: 5.0   // Critical if volume is local
        };
    }

    /**
     * Calculate score for a node/pod pair
     * @returns {number} 0-1000 weighted score
     */
    score(node, podSpec) {
        let totalScore = 0;
        let totalWeight = 0;

        for (const [strategyName, fn] of Object.entries(STRATEGIES)) {
            const weight = this.weights[strategyName] || 1;
            const score = fn(node, podSpec);

            totalScore += (score * weight);
            totalWeight += weight;
        }

        return totalScore;
    }
}

module.exports = new NodeScorer();
