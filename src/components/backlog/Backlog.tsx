import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Stack,
  Collapse,
} from "@mui/material";
import styled from "@emotion/styled";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import PendingIcon from "@mui/icons-material/Pending";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BugReportIcon from "@mui/icons-material/BugReport";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LabelIcon from "@mui/icons-material/Label";

// Types for our backlog items
type WorkItemType = "Epic" | "Feature" | "Task" | "Bug";

interface BacklogItem {
  id: number;
  title: string;
  type: WorkItemType;
  state: string;
  priority: string;
  assignedTo?: string;
  parentId?: number; // ID of parent item for hierarchy
  tags?: string[];
  description?: string;
  estimate?: number;
}

// Define a type for the extended BacklogItem with children
interface BacklogItemWithChildren extends BacklogItem {
  children: BacklogItemWithChildren[];
}

// Styled components for our UI
const BacklogContainer = styled(Box)`
  background: #181a17;
  width: 100%;
  height: 100%;
  color: #fff;
  overflow: auto;
`;

const ToolbarContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  background: #232422;
  border-bottom: 1px solid #333;
  align-items: center;

  @media (min-width: 768px) {
    padding: 16px 24px;
  }
`;

const ListHeader = styled(Box)`
  display: flex;
  padding: 8px 16px;
  background: #1e1f1c;
  border-bottom: 1px solid #333;
  font-weight: 500;

  @media (min-width: 768px) {
    padding: 12px 24px;
  }
`;

const WorkItemRow = styled.div<{
  isExpandable?: boolean;
  indentLevel?: number;
  isExpanded?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  color: #bdbdbd;
  font-size: 14px;
  cursor: ${(props) => (props.isExpandable ? "pointer" : "default")};
  background: ${(props) => (props.isExpanded ? "#2a2c29" : "#232422")};
  padding-left: ${(props) =>
    props.indentLevel ? `${props.indentLevel * 32 + 16}px` : "16px"};

  &:hover {
    background: #2a2c29;
  }
`;

// Rename PriorityIndicator to TypeIndicator and update it to display color based on item type
const TypeIndicator = styled(Box)<{ itemType: WorkItemType }>`
  width: 4px;
  align-self: stretch;
  background: ${(props) => {
    switch (props.itemType) {
      case "Epic":
        return "#8777D9"; // Purple for Epics
      case "Feature":
        return "#5243AA"; // Darker purple for Features
      case "Task":
        return "#4285F4"; // Blue for Tasks
      case "Bug":
        return "#FF5630"; // Red for Bugs
      default:
        return "#909090";
    }
  }};
  margin-right: 12px;
`;

const ItemType = styled(Chip)`
  background: #333;
  height: 22px;
  font-size: 11px;

  @media (min-width: 768px) {
    font-size: 12px;
    height: 24px;
  }
`;

const StateChip = styled(Chip)<{ state: string }>`
  background: ${(props) => {
    switch (props.state) {
      case "Done":
        return "rgba(54, 179, 126, 0.2)";
      case "In Progress":
        return "rgba(255, 171, 0, 0.2)";
      case "To Do":
        return "rgba(101, 84, 192, 0.2)";
      default:
        return "#333";
    }
  }};
  color: ${(props) => {
    switch (props.state) {
      case "Done":
        return "#36B37E";
      case "In Progress":
        return "#FFAB00";
      case "To Do":
        return "#6554C0";
      default:
        return "#fff";
    }
  }};
  height: 22px;
  font-size: 11px;

  @media (min-width: 768px) {
    font-size: 12px;
    height: 24px;
  }
`;

const ActionButton = styled(Button)`
  text-transform: none;
  padding: 6px 12px;
  color: #fff;
  background: #2d2f2c;
  font-size: 13px;

  &:hover {
    background: #3a3d39;
  }

  .MuiButton-startIcon {
    margin-right: 6px;
  }
`;

const StyledTextField = styled(TextField)`
  background: #2d2f2c;
  border-radius: 4px;

  .MuiOutlinedInput-notchedOutline {
    border-color: #444;
  }

  .MuiInputBase-input {
    color: #fff;
    font-size: 14px;
    padding: 8px 12px;
    height: 20px;
  }

  .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #666;
  }

  .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #4fa3ff;
    border-width: 1px;
  }
`;

const StyledIconButton = styled(IconButton)`
  color: #ccc;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

// Get state icon based on state name
const getStateIcon = (state: string) => {
  switch (state) {
    case "Done":
      return <CheckCircleIcon fontSize="small" style={{ color: "#36B37E" }} />;
    case "In Progress":
      return <PendingIcon fontSize="small" style={{ color: "#FFAB00" }} />;
    case "To Do":
      return <NotStartedIcon fontSize="small" style={{ color: "#6554C0" }} />;
    default:
      return null;
  }
};

// Get type icon based on type
const getTypeIcon = (type: WorkItemType) => {
  switch (type) {
    case "Epic":
      return <LabelIcon fontSize="small" style={{ color: "#8777D9" }} />;
    case "Feature":
      return <EngineeringIcon fontSize="small" style={{ color: "#5243AA" }} />;
    case "Task":
      return <AssignmentIcon fontSize="small" style={{ color: "#4285F4" }} />;
    case "Bug":
      return <BugReportIcon fontSize="small" style={{ color: "#FF5630" }} />;
    default:
      return <AssignmentIcon fontSize="small" style={{ color: "#4285F4" }} />;
  }
};

// Get color for work item type
const getTypeColor = (type: WorkItemType) => {
  switch (type) {
    case "Epic":
      return { bg: "rgba(135, 119, 217, 0.2)", text: "#8777D9" };
    case "Feature":
      return { bg: "rgba(82, 67, 170, 0.2)", text: "#5243AA" };
    case "Task":
      return { bg: "rgba(66, 133, 244, 0.2)", text: "#4285F4" };
    case "Bug":
      return { bg: "rgba(255, 86, 48, 0.2)", text: "#FF5630" };
    default:
      return { bg: "#333", text: "#fff" };
  }
};

// Update the buildItemTree function to use the explicit type
const buildItemTree = (items: BacklogItem[]): BacklogItemWithChildren[] => {
  const itemMap = new Map<number, BacklogItemWithChildren>();

  // First, create all items with empty children arrays
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Then, populate the children arrays
  const rootItems: BacklogItemWithChildren[] = [];

  items.forEach((item) => {
    if (item.parentId && itemMap.has(item.parentId)) {
      itemMap.get(item.parentId)?.children.push(itemMap.get(item.id)!);
    } else {
      // No parent or parent doesn't exist, so it's a root item
      rootItems.push(itemMap.get(item.id)!);
    }
  });

  return rootItems;
};

// Main backlog component
const Backlog: React.FC = () => {
  // State for expanded items
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Toggle expand/collapse for an item
  const toggleItemExpand = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  // State for backlog items
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([
    {
      id: 1,
      title: "User Authentication System",
      type: "Epic",
      state: "In Progress",
      priority: "Critical",
      tags: ["Release 1", "Security"],
    },
    {
      id: 2,
      title: "User Registration Flow",
      type: "Feature",
      state: "In Progress",
      priority: "High",
      parentId: 1,
      assignedTo: "Onur Canogul",
    },
    {
      id: 3,
      title: "Login & Password Reset",
      type: "Feature",
      state: "To Do",
      priority: "High",
      parentId: 1,
      tags: ["UI", "Sprint 2"],
    },
    {
      id: 4,
      title: "Database Schema Setup",
      type: "Task",
      state: "Done",
      priority: "High",
      parentId: 2,
      assignedTo: "Onur Canogul",
    },
    {
      id: 5,
      title: "User Profile Component",
      type: "Task",
      state: "In Progress",
      priority: "Medium",
      parentId: 2,
    },
    {
      id: 6,
      title: "Registration Validation Bug",
      type: "Bug",
      state: "To Do",
      priority: "High",
      parentId: 2,
      assignedTo: "Onur Canogul",
    },
    {
      id: 7,
      title: "Frontend Dashboard",
      type: "Epic",
      state: "To Do",
      priority: "Medium",
      tags: ["UI", "Release 1"],
    },
    {
      id: 8,
      title: "Data Visualization Components",
      type: "Feature",
      state: "To Do",
      priority: "Medium",
      parentId: 7,
    },
    {
      id: 9,
      title: "User Activity Feed",
      type: "Feature",
      state: "To Do",
      priority: "Low",
      parentId: 7,
      tags: ["UI", "Sprint 3"],
    },
    {
      id: 10,
      title: "Chart Library Integration",
      type: "Task",
      state: "To Do",
      priority: "Medium",
      parentId: 8,
    },
    {
      id: 11,
      title: "Activity Filter Component",
      type: "Task",
      state: "To Do",
      priority: "Low",
      parentId: 9,
    },
    {
      id: 12,
      title: "API Integration System",
      type: "Epic",
      state: "To Do",
      priority: "High",
    },
  ]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Search function
  const filteredItems = backlogItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.assignedTo &&
        item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags &&
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // Build tree for filtered items
  const itemTree = buildItemTree(filteredItems);

  // Update the renderItems function to use the correct type
  const renderItems = (items: BacklogItemWithChildren[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.has(item.id);
      const typeColor = getTypeColor(item.type);

      return (
        <div key={item.id}>
          <WorkItemRow
            data-expandable={hasChildren}
            data-indent-level={level}
            data-expanded={isExpanded}
            onClick={() => hasChildren && toggleItemExpand(item.id, {})}
          >
            <TypeIndicator itemType={item.type} />

            <Stack direction="row" sx={{ width: "100%" }}>
              <Box
                sx={{
                  width: { xs: "100%", md: "40%" },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {hasChildren && (
                  <StyledIconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItemExpand(item.id, e);
                    }}
                    sx={{ mr: 1 }}
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </StyledIconButton>
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DragIndicatorIcon
                    sx={{ color: "#666", fontSize: 20, cursor: "grab" }}
                  />

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ItemType
                        label={item.type}
                        size="small"
                        icon={getTypeIcon(item.type)}
                        sx={{
                          bgcolor: typeColor.bg,
                          color: typeColor.text,
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          display: { xs: "none", sm: "inline" },
                        }}
                      >
                        #{item.id}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      fontWeight={
                        item.type === "Epic"
                          ? 600
                          : item.type === "Feature"
                          ? 500
                          : 400
                      }
                    >
                      {item.title}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  width: { md: "20%" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getStateIcon(item.state)}
                  <StateChip
                    label={item.state}
                    size="small"
                    state={item.state}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: { md: "20%" },
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography variant="body2">
                  {item.assignedTo || "—"}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: { md: "20%" },
                  display: { xs: "none", md: "block" },
                }}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {item.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        color: "#ccc",
                      }}
                    />
                  )) || "—"}
                </Box>
              </Box>
            </Stack>

            {/* Actions menu */}
            <Box ml="auto" display="flex" alignItems="center">
              <Tooltip title="Actions">
                <StyledIconButton size="small">
                  <MoreHorizIcon />
                </StyledIconButton>
              </Tooltip>
            </Box>
          </WorkItemRow>

          {/* Render children if expanded */}
          {hasChildren && isExpanded && renderItems(item.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <BacklogContainer>
      {/* Toolbar */}
      <ToolbarContainer>
        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              width: { xs: "100%", sm: "auto" },
              mb: { xs: 1, sm: 0 },
            }}
          >
            <ActionButton variant="contained" startIcon={<AddIcon />}>
              New Work Item
            </ActionButton>

            <ActionButton variant="contained" startIcon={<FilterListIcon />}>
              Filter
            </ActionButton>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            sx={{
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <StyledTextField
              placeholder="Search backlog items..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon style={{ marginRight: 8, color: "#ccc" }} />
                ),
              }}
              sx={{ width: { xs: "100%", sm: "250px" } }}
            />
          </Stack>
        </Stack>
      </ToolbarContainer>

      {/* List Header */}
      <ListHeader>
        <Stack direction="row" sx={{ width: "100%" }}>
          <Box sx={{ width: { xs: "100%", md: "40%" } }}>
            <Typography variant="body2" fontWeight={600}>
              Work Item
            </Typography>
          </Box>

          <Box
            sx={{
              width: { md: "20%" },
              display: { xs: "none", sm: "block" },
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              State
            </Typography>
          </Box>

          <Box
            sx={{
              width: { md: "20%" },
              display: { xs: "none", md: "block" },
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Assigned To
            </Typography>
          </Box>

          <Box
            sx={{
              width: { md: "20%" },
              display: { xs: "none", md: "block" },
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Tags
            </Typography>
          </Box>
        </Stack>
      </ListHeader>

      {/* List Items */}
      {filteredItems.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography variant="body1">
            No backlog items match your search.
          </Typography>
        </Box>
      ) : (
        renderItems(buildItemTree(filteredItems))
      )}
    </BacklogContainer>
  );
};

export default Backlog;
