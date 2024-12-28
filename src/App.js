// Student ID: 21B030952
// Student Fullname: Kambar Azizbek

import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
  Radio,
  RadioGroup,
  DatePicker,
} from "@mantine/core";
import { MoonStars, Sun, Trash, Edit } from "tabler-icons-react";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");
    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    }
  }

  function saveTasks(updatedTasks) {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }
  const [createModalOpened, setCreateModalOpened] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newState, setNewState] = useState("Not done");
  const [newDeadline, setNewDeadline] = useState("");

  function createTask() {
    const task = {
      title: newTitle,
      summary: newSummary,
      state: newState,
      deadline: newDeadline,
    };

    setTasks((prevTasks) => {
      const updated = [...prevTasks, task];
      saveTasks(updated);
      return updated;
    });

    setNewTitle("");
    setNewSummary("");
    setNewState("Not done");
    setNewDeadline("");
  }

  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editState, setEditState] = useState("Not done");
  const [editDeadline, setEditDeadline] = useState("");

  function openEditModal(index) {
    setEditIndex(index);

    const taskToEdit = tasks[index];
    setEditTitle(taskToEdit.title || "");
    setEditSummary(taskToEdit.summary || "");
    setEditState(taskToEdit.state || "Not done");
    setEditDeadline(taskToEdit.deadline || "");

    setEditModalOpened(true);
  }

  function saveEdits() {
    setTasks((prev) => {
      const updated = [...prev];
      updated[editIndex] = {
        ...updated[editIndex],
        title: editTitle,
        summary: editSummary,
        state: editState,
        deadline: editDeadline,
      };
      saveTasks(updated);
      return updated;
    });
    setEditModalOpened(false);
  }

  function deleteTask(index) {
    setTasks((prevTasks) => {
      const updated = prevTasks.filter((_, i) => i !== index);
      saveTasks(updated);
      return updated;
    });
  }

  const [sortStateFirst, setSortStateFirst] = useState(null);
  const [filterByState, setFilterByState] = useState(null);
  const [sortByDeadline, setSortByDeadline] = useState(false);

  const displayedTasks = getDisplayedTasks();

  function getDisplayedTasks() {
    let result = [...tasks];

    if (filterByState) {
      result = result.filter((task) => task.state === filterByState);
    }

    if (sortStateFirst) {
      result.sort((a, b) => {
        if (a.state === sortStateFirst && b.state !== sortStateFirst) return -1;
        if (b.state === sortStateFirst && a.state !== sortStateFirst) return 1;
        return 0;
      });
    }

    if (sortByDeadline) {
      result.sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline) : null;
        const dateB = b.deadline ? new Date(b.deadline) : null;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA - dateB;
      });
    }

    return result;
  }

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          {/** CREATE TASK MODAL */}
          <Modal
            opened={createModalOpened}
            size="md"
            title="New Task"
            withCloseButton
            onClose={() => setCreateModalOpened(false)}
            centered
          >
            <TextInput
              label="Title"
              required
              placeholder="Task Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.currentTarget.value)}
              mt="md"
            />
            <TextInput
              label="Summary"
              placeholder="Task Summary"
              value={newSummary}
              onChange={(e) => setNewSummary(e.currentTarget.value)}
              mt="md"
            />

            {/** Could be a Radio Group, or a Select. Example with Select: */}
            <Select
              label="State"
              data={[
                { value: "Done", label: "Done" },
                { value: "Doing right now", label: "Doing right now" },
                { value: "Not done", label: "Not done" },
              ]}
              value={newState}
              onChange={setNewState}
              mt="md"
            />

            {/**
             * For the deadline, you can use a DatePicker from @mantine/dates:
             *
             * <DatePicker
             *   label="Deadline"
             *   placeholder="Pick date"
             *   value={newDeadline ? new Date(newDeadline) : null}
             *   onChange={(date) => setNewDeadline(date?.toISOString() ?? "")}
             *   mt="md"
             * />
             *
             * OR a simple <TextInput type="date" />
             */}
            <TextInput
              type="date"
              label="Deadline"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.currentTarget.value)}
              mt="md"
            />

            <Group mt="md" position="apart">
              <Button variant="subtle" onClick={() => setCreateModalOpened(false)}>
                Close
              </Button>
              <Button onClick={createTask}>Create Task</Button>
            </Group>
          </Modal>

          {/** EDIT TASK MODAL */}
          <Modal
            opened={editModalOpened}
            size="md"
            title="Edit Task"
            onClose={() => setEditModalOpened(false)}
            centered
          >
            <TextInput
              label="Title"
              required
              placeholder="Task Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.currentTarget.value)}
              mt="md"
            />
            <TextInput
              label="Summary"
              placeholder="Task Summary"
              value={editSummary}
              onChange={(e) => setEditSummary(e.currentTarget.value)}
              mt="md"
            />
            <Select
              label="State"
              data={[
                { value: "Done", label: "Done" },
                { value: "Doing right now", label: "Doing right now" },
                { value: "Not done", label: "Not done" },
              ]}
              value={editState}
              onChange={setEditState}
              mt="md"
            />
            <TextInput
              type="date"
              label="Deadline"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.currentTarget.value)}
              mt="md"
            />

            <Group mt="md" position="apart">
              <Button
                variant="subtle"
                onClick={() => {
                  setEditModalOpened(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveEdits}>Save Changes</Button>
            </Group>
          </Modal>

          {/** MAIN CONTAINER */}
          <Container size={600} my={40}>
            <Group position="apart">
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon color="blue" onClick={() => toggleColorScheme()} size="lg">
                {colorScheme === "dark" ? <Sun size={16} /> : <MoonStars size={16} />}
              </ActionIcon>
            </Group>

            {/** SORTING & FILTERING BUTTONS */}
            <Group mt="md">
              <Button
                variant={sortStateFirst === "Done" ? "filled" : "light"}
                onClick={() =>
                  setSortStateFirst((prev) => (prev === "Done" ? null : "Done"))
                }
              >
                Show "Done" first
              </Button>
              <Button
                variant={sortStateFirst === "Doing right now" ? "filled" : "light"}
                onClick={() =>
                  setSortStateFirst((prev) =>
                    prev === "Doing right now" ? null : "Doing right now"
                  )
                }
              >
                Show "Doing" first
              </Button>
              <Button
                variant={sortStateFirst === "Not done" ? "filled" : "light"}
                onClick={() =>
                  setSortStateFirst((prev) => (prev === "Not done" ? null : "Not done"))
                }
              >
                Show "Not done" first
              </Button>
            </Group>

            <Group mt="md">
              <Button
                variant={filterByState === "Done" ? "filled" : "light"}
                onClick={() =>
                  setFilterByState((prev) => (prev === "Done" ? null : "Done"))
                }
              >
                Show only "Done"
              </Button>
              <Button
                variant={filterByState === "Not done" ? "filled" : "light"}
                onClick={() =>
                  setFilterByState((prev) => (prev === "Not done" ? null : "Not done"))
                }
              >
                Show only "Not done"
              </Button>
              <Button
                variant={filterByState === "Doing right now" ? "filled" : "light"}
                onClick={() =>
                  setFilterByState((prev) =>
                    prev === "Doing right now" ? null : "Doing right now"
                  )
                }
              >
                Show only "Doing"
              </Button>
            </Group>

            <Button
              mt="md"
              variant={sortByDeadline ? "filled" : "light"}
              onClick={() => setSortByDeadline((p) => !p)}
            >
              Sort by deadline
            </Button>

            {displayedTasks.length > 0 ? (
              displayedTasks.map((task, index) => {
                if (!task.title) return null;
                return (
                  <Card withBorder key={index} mt="sm">
                    <Group position="apart">
                      <Text weight="bold">{task.title}</Text>
                      <Group>
                        {/** EDIT button */}
                        <ActionIcon
                          onClick={() => openEditModal(index)}
                          color="blue"
                          variant="transparent"
                        >
                          <Edit />
                        </ActionIcon>
                        {/** DELETE button */}
                        <ActionIcon
                          onClick={() => deleteTask(index)}
                          color="red"
                          variant="transparent"
                        >
                          <Trash />
                        </ActionIcon>
                      </Group>
                    </Group>

                    <Text color="dimmed" size="sm" mt="xs">
                      {task.summary
                        ? task.summary
                        : "No summary was provided for this task"}
                    </Text>

                    <Text size="sm" mt="xs">
                      <b>State:</b> {task.state}
                    </Text>

                    <Text size="sm" mt="xs">
                      <b>Deadline:</b>{" "}
                      {task.deadline ? task.deadline : "No deadline"}
                    </Text>
                  </Card>
                );
              })
            ) : (
              <Text size="lg" mt="md" color="dimmed">
                You have no tasks
              </Text>
            )}

            <Button onClick={() => setCreateModalOpened(true)} fullWidth mt="md">
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
