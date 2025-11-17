'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, Globe, MapPin, Server, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface TreeNode {
  id: string;
  label: string;
  type: 'continent' | 'country' | 'region' | 'host';
  status?: 'Active' | 'Reserved' | 'Retired' | 'Released';
  utilization?: number;
  children?: TreeNode[];
  metadata?: {
    cidr?: string;
    ipAddress?: string;
    allocatedCount?: number;
    totalCapacity?: number;
  };
}

interface IPHierarchyTreeProps {
  data: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
  expandedByDefault?: boolean;
  showUtilization?: boolean;
  className?: string;
}

export function IPHierarchyTree({
  data,
  onNodeClick,
  expandedByDefault = false,
  showUtilization = true,
  className,
}: IPHierarchyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    expandedByDefault ? new Set(data.map((node) => node.id)) : new Set()
  );
  const router = useRouter();

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        allIds.add(node.id);
        if (node.children) {
          collectIds(node.children);
        }
      });
    };
    collectIds(data);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const getNodeIcon = (type: TreeNode['type'], isExpanded: boolean) => {
    const iconClass = 'h-4 w-4';
    switch (type) {
      case 'continent':
        return <Globe className={iconClass} />;
      case 'country':
        return <Globe className={iconClass} />;
      case 'region':
        return <MapPin className={iconClass} />;
      case 'host':
        return <Server className={iconClass} />;
      default:
        return <Circle className={iconClass} />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 dark:text-green-400';
      case 'Reserved':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Retired':
      case 'Released':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getUtilizationColor = (utilization?: number) => {
    if (utilization === undefined) return 'bg-gray-200 dark:bg-gray-700';
    if (utilization < 50) return 'bg-green-500';
    if (utilization < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleNodeClick = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onNodeClick) {
      onNodeClick(node);
    } else {
      // Default navigation behavior
      switch (node.type) {
        case 'country':
          router.push(`/countries/${node.id}`);
          break;
        case 'region':
          router.push(`/regions/${node.id}`);
          break;
        case 'host':
          router.push(`/hosts/${node.id}`);
          break;
      }
    }
  };

  const renderNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const indent = level * 24;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            'flex items-center gap-2 py-2 px-3 rounded-md transition-colors',
            'hover:bg-accent hover:text-accent-foreground cursor-pointer',
            'group'
          )}
          style={{ paddingLeft: `${indent + 12}px` }}
          onClick={(e) => {
            if (hasChildren) {
              toggleNode(node.id);
            }
            handleNodeClick(node, e);
          }}
        >
          {/* Expand/Collapse Icon */}
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <div className="w-4" />
            )}
          </div>

          {/* Node Icon */}
          <div className={cn('flex-shrink-0', getStatusColor(node.status))}>
            {getNodeIcon(node.type, isExpanded)}
          </div>

          {/* Node Label */}
          <span className="font-medium flex-1 truncate">{node.label}</span>

          {/* Metadata */}
          {node.metadata?.cidr && (
            <code className="text-xs text-muted-foreground font-mono">
              {node.metadata.cidr}
            </code>
          )}
          {node.metadata?.ipAddress && (
            <code className="text-xs text-muted-foreground font-mono">
              {node.metadata.ipAddress}
            </code>
          )}

          {/* Status Badge */}
          {node.status && (
            <Badge variant="outline" className="text-xs">
              {node.status}
            </Badge>
          )}

          {/* Utilization */}
          {showUtilization && node.utilization !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full transition-all', getUtilizationColor(node.utilization))}
                  style={{ width: `${node.utilization}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">
                {node.utilization.toFixed(0)}%
              </span>
            </div>
          )}

          {/* Allocation Count */}
          {node.metadata?.allocatedCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              {node.metadata.allocatedCount}/{node.metadata.totalCapacity}
            </span>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Controls */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={expandAll}>
          Expand All
        </Button>
        <Button variant="outline" size="sm" onClick={collapseAll}>
          Collapse All
        </Button>
      </div>

      {/* Tree */}
      <div className="border rounded-lg p-2 bg-card">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No data available
          </div>
        ) : (
          data.map((node) => renderNode(node, 0))
        )}
      </div>
    </div>
  );
}
