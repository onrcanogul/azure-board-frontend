import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
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
import EditIcon from "@mui/icons-material/Edit";

// PBI Context
import { usePbiContext } from "../../context/PbiContext";
import { PbiState } from "../../domain/models/productBacklogItem";
import type { ProductBacklogItem } from "../../domain/models/productBacklogItem";
import PbiEditDialog from "./PbiEditDialog";

// Styled components (reusing styles from original Backlog.tsx)
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

const TypeIndicator = styled(Box)<{ itemType: string }>`
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
      case PbiState.CLOSED:
        return "rgba(54, 179, 126, 0.2)";
      case PbiState.ACTIVE:
        return "rgba(255, 171, 0, 0.2)";
      case PbiState.NEW:
        return "rgba(101, 84, 192, 0.2)";
      case PbiState.RESOLVED:
        return "rgba(79, 163, 255, 0.2)";
      default:
        return "#333";
    }
  }};
  color: ${(props) => {
    switch (props.state) {
      case PbiState.CLOSED:
        return "#36B37E";
      case PbiState.ACTIVE:
        return "#FFAB00";
      case PbiState.NEW:
        return "#6554C0";
      case PbiState.RESOLVED:
        return "#4fa3ff";
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

// Helper to convert PBI state to display string
const formatPbiState = (state: PbiState): string => {
  switch (state) {
    case PbiState.NEW:
      return "New";
    case PbiState.ACTIVE:
      return "Active";
    case PbiState.RESOLVED:
      return "Resolved";
    case PbiState.CLOSED:
      return "Closed";
    default:
      return "Unknown";
  }
};

// Helper to get state icon based on PBI state
const getStateIcon = (state: PbiState) => {
  switch (state) {
    case PbiState.CLOSED:
      return <CheckCircleIcon fontSize="small" style={{ color: "#36B37E" }} />;
    case PbiState.ACTIVE:
      return <PendingIcon fontSize="small" style={{ color: "#FFAB00" }} />;
    case PbiState.NEW:
      return <NotStartedIcon fontSize="small" style={{ color: "#6554C0" }} />;
    case PbiState.RESOLVED:
      return <CheckCircleIcon fontSize="small" style={{ color: "#4fa3ff" }} />;
    default:
      return null;
  }
};

// Map PBI to work item type for display
const mapPbiToWorkItemType = (pbi: ProductBacklogItem): string => {
  // This is a placeholder - in a real app, you might determine
  // the type based on properties of the PBI or related entities
  // For now, we'll just return "Task" as default
  return "Task";
};

// Get type icon based on work item type
const getTypeIcon = (type: string) => {
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
const getTypeColor = (type: string) => {
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

// Main backlog component
const BacklogWithRealTimeUpdates: React.FC = () => {
  // Get PBIs and related methods from context
  const { pbis, loading, error, refreshPbis } = usePbiContext();

  // State for expanded items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // State for search/filtering
  const [searchTerm, setSearchTerm] = useState("");

  // State for edit dialog
  const [selectedPbi, setSelectedPbi] = useState<ProductBacklogItem | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Toggle expand/collapse for an item
  const toggleItemExpand = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  // Filter PBIs based on search term
  const filteredPbis = pbis.filter(
    (pbi) =>
      !pbi.isDeleted && // Filter out deleted items
      (pbi.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pbi.functionalDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        pbi.technicalDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  // Handle opening edit dialog
  const handleEditPbi = (pbi: ProductBacklogItem, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedPbi(pbi);
    setIsEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedPbi(null);
  };

  // Render PBI items
  const renderPbiItems = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress sx={{ color: "#4fa3ff" }} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    if (filteredPbis.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            No product backlog items found.
          </Typography>
        </Box>
      );
    }

    return filteredPbis.map((pbi) => {
      const isExpanded = expandedItems.has(pbi.id);
      const workItemType = mapPbiToWorkItemType(pbi);
      const typeColor = getTypeColor(workItemType);

      return (
        <WorkItemRow
          key={pbi.id}
          isExpandable={false} // Currently no child items in this implementation
          isExpanded={isExpanded}
        >
          <TypeIndicator itemType={workItemType} />

          <Stack direction="row" sx={{ width: "100%" }}>
            <Box
              sx={{
                width: { xs: "100%", md: "40%" },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DragIndicatorIcon
                  sx={{ color: "#666", fontSize: 20, cursor: "grab" }}
                />

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ItemType
                      label={workItemType}
                      size="small"
                      icon={getTypeIcon(workItemType)}
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
                      #{pbi.id.substring(0, 6)}
                    </Typography>
                  </Box>

                  <Typography variant="body1" fontWeight={500}>
                    {pbi.description}
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
                {getStateIcon(pbi.state)}
                <StateChip
                  label={formatPbiState(pbi.state)}
                  size="small"
                  state={pbi.state}
                />
              </Box>
            </Box>

            <Box
              sx={{
                width: { md: "20%" },
                display: { xs: "none", md: "block" },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2">
                  Priority: {pbi.priority}
                </Typography>
                <Typography variant="body2">
                  Points: {pbi.storyPoint}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                width: { md: "20%" },
                display: { xs: "none", md: "block" },
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <Chip
                  label={`Business Value: ${pbi.businessValue}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 11,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "#ccc",
                  }}
                />
              </Box>
            </Box>
          </Stack>

          {/* Actions menu */}
          <Box ml="auto" display="flex" alignItems="center">
            <Tooltip title="Edit PBI">
              <StyledIconButton
                size="small"
                onClick={(e) => handleEditPbi(pbi, e)}
              >
                <EditIcon fontSize="small" />
              </StyledIconButton>
            </Tooltip>
            <Tooltip title="More Actions">
              <StyledIconButton size="small">
                <MoreHorizIcon />
              </StyledIconButton>
            </Tooltip>
          </Box>
        </WorkItemRow>
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
              New PBI
            </ActionButton>

            <ActionButton variant="contained" startIcon={<FilterListIcon />}>
              Filter
            </ActionButton>

            <ActionButton variant="contained" onClick={refreshPbis}>
              Refresh
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
              placeholder="Search PBIs..."
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
              Product Backlog Item
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
              Priority / Points
            </Typography>
          </Box>

          <Box
            sx={{
              width: { md: "20%" },
              display: { xs: "none", md: "block" },
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Business Value
            </Typography>
          </Box>
        </Stack>
      </ListHeader>

      {/* List Items */}
      <Box>{renderPbiItems()}</Box>

      {/* Edit Dialog */}
      <PbiEditDialog
        pbi={selectedPbi}
        isOpen={isEditDialogOpen}
        onDismiss={handleCloseEditDialog}
      />
    </BacklogContainer>
  );
};

export default BacklogWithRealTimeUpdates;
