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
  epicId?: number; // ID of parent Epic
  featureId?: number; // ID of parent Feature
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
  itemType?: WorkItemType;
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
    props.indentLevel ? `${props.indentLevel * 24 + 16}px` : "16px"};
  position: relative;

  &:hover {
    background: #2a2c29;
  }

  /* Connection lines for hierarchy visualization */
  ${(props) =>
    props.indentLevel && props.indentLevel > 0
      ? `
    /* Vertical line */
    &::before {
      content: "";
      position: absolute;
      left: ${(props.indentLevel - 1) * 24 + 28}px;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #444;
    }
    
    /* Horizontal connector */
    &::after {
      content: "";
      position: absolute;
      left: ${(props.indentLevel - 1) * 24 + 28}px;
      top: 50%;
      width: 16px;
      height: 1px;
      background-color: #444;
    }
    
    /* Adjust vertical line for last child */
    &:last-child::before {
      height: 50%;
    }
    
    &:hover::before, &:hover::after {
      background-color: #666;
    }
  `
      : ""}
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

// Update the buildItemTree function to handle the new hierarchy
const buildItemTree = (items: BacklogItem[]): BacklogItemWithChildren[] => {
  const itemMap = new Map<number, BacklogItemWithChildren>();
  const epicItems: BacklogItemWithChildren[] = [];

  // First, create all items with empty children arrays
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Then, organize items into the hierarchy
  items.forEach((item) => {
    const currentItem = itemMap.get(item.id)!;

    if (item.type === "Epic") {
      epicItems.push(currentItem);
    } else if (item.type === "Feature" && item.epicId) {
      const epic = itemMap.get(item.epicId);
      if (epic) {
        epic.children.push(currentItem);
      }
    } else if (
      (item.type === "Task" || item.type === "Bug") &&
      item.featureId
    ) {
      const feature = itemMap.get(item.featureId);
      if (feature) {
        feature.children.push(currentItem);
      }
    }
  });

  return epicItems;
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
      title: "Epic 1",
      type: "Epic",
      state: "In Progress",
      priority: "High",
    },
    {
      id: 2,
      title: "Feature 1",
      type: "Feature",
      state: "To Do",
      priority: "Medium",
      epicId: 1,
    },
    {
      id: 3,
      title: "PBI 1",
      type: "Task",
      state: "To Do",
      priority: "Low",
      featureId: 2,
    },
    {
      id: 4,
      title: "Bug 1",
      type: "Bug",
      state: "To Do",
      priority: "Low",
      featureId: 2,
    },
    {
      id: 5,
      title: "Feature 2",
      type: "Feature",
      state: "To Do",
      priority: "Medium",
      epicId: 1,
    },
    {
      id: 6,
      title: "PBI 2",
      type: "Task",
      state: "To Do",
      priority: "Low",
      featureId: 5,
    },
    { id: 7, title: "Epic 2", type: "Epic", state: "To Do", priority: "High" },
    {
      id: 8,
      title: "Feature 3",
      type: "Feature",
      state: "To Do",
      priority: "Medium",
      epicId: 7,
    },
    {
      id: 9,
      title: "PBI 3",
      type: "Task",
      state: "To Do",
      priority: "Low",
      featureId: 8,
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

  // Update the renderItems function to handle the new hierarchy
  const renderItems = (items: BacklogItemWithChildren[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.has(item.id);
      const typeColor = getTypeColor(item.type);

      return (
        <div key={item.id}>
          <WorkItemRow
            isExpandable={hasChildren}
            indentLevel={level}
            isExpanded={isExpanded}
            itemType={item.type}
            onClick={(e) => hasChildren && toggleItemExpand(item.id, e)}
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
