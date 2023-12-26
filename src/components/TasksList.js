import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import EditTask from './EditTask';
import DeleteTask from './DeleteTask';
import {AddTask} from './AddTask';
import SaveTask from "./SaveTask";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(----white, #FFF);
  font-family: Inter,serif;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 48px;
`;

const TaskItem = styled.li`
  display: flex;
  width: 796px;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  background: var(----inputBg_task, #111827);
  margin-bottom: 24px;
`;

const TaskText = styled.span`
  color: var(----white, #FFF);
  font-family: Inter,serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
`;

const Checkbox = styled.input`
  position: relative;
  width: 45px;
  height: 45px;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  border: 2px solid #4caf50;
  border-radius: 4px;
  background-color: ${({checked}) => (checked ? '#4caf50' : 'transparent')};
  cursor: pointer;

  &:checked {
    background-color: #4caf50;
  }

  &:before {
    content: '';
    position: absolute;
    width: 6px;
    height: 12px;
    top: 50%;
    left: 50%;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: translate(-50%, -50%) rotate(45deg);
    opacity: ${({checked}) => (checked ? '1' : '0')};
  }
`;

const EditButton = styled.button`
  font-family: Inter,serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%, rgba(255, 255, 255, 0.00) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  outline: none;
  border: 0;
`;

const DeleteButton = styled.button`
  color: var(----crimson, #DC143C);
  font-family: Inter,serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  text-transform: uppercase;
  outline: none;
  border: 0;
  background: transparent;
`;

const SearchInput = styled.input`
  color: var(----input-placeholder, #818181);
  font-family: Inter,serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  border-radius: 24px;
  border: 1px solid var(----white, #FFF);
  background: var(----inputBg_add-task, #1F2937);
`;
const fetchTasks = async () => {
    return JSON.parse(localStorage.getItem('tasks')) || [];
};


const updateTaskStatus = async ({ taskId, completed }) => {
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = existingTasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return updatedTasks;
};


export const TasksList = () => {
    const queryClient = useQueryClient();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const editTaskButtonClick = (taskId) => {
        setIsEditModalVisible(true);
        setCurrentTaskId(taskId);
    };

    const deleteTaskButtonClick = (taskId) => {
        setIsDeleteModalVisible(true);
        setCurrentTaskId(taskId);
    };

    const closeEditAlert = () => {
        setIsEditModalVisible(false);
    };

    const closeDeleteAlert = () => {
        setIsDeleteModalVisible(false);
    };

    const renderEditModal = () => {
        if (!isEditModalVisible) {
            return null;
        }
        return <EditTask close={closeEditAlert} taskId={currentTaskId} />;
    };

    const renderDeleteModal = () => {
        if (!isDeleteModalVisible) {
            return null;
        }
        return <DeleteTask close={closeDeleteAlert} taskId={currentTaskId} />;
    };

    const { data: tasks, isLoading, isError } = useQuery('tasks', fetchTasks);

    const mutationUpdate = useMutation(updateTaskStatus, {
        onSuccess: (data) => {
            queryClient.setQueryData('tasks', data);
        },
    });

    const handleCheckboxChange = (taskId, completed) => {
        mutationUpdate.mutate({ taskId, completed: !completed });
    };

    const handleSearchInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const filteredTasks = tasks
        ? tasks.filter((task) =>
            task.text.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [];

    return (
        <>
            {renderEditModal()}
            {renderDeleteModal()}
            <Container>
                <h2>Список задач</h2>
                <SearchInput
                    type="text"
                    value={searchValue}
                    onChange={handleSearchInputChange}
                    placeholder="Поиск задач..."
                />

                <ul>
                    {filteredTasks.map((task) => (
                        <TaskItem key={task.id}>
                            <Checkbox
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleCheckboxChange(task.id, task.completed)}
                            />
                            <TaskText completed={task.completed}>{task.text}</TaskText>
                            <EditButton onClick={() => editTaskButtonClick(task.id)}>
                                Edit
                            </EditButton>
                            <DeleteButton onClick={() => deleteTaskButtonClick(task.id)}>
                                Delete
                            </DeleteButton>
                        </TaskItem>
                    ))}
                </ul>
            </Container>
        </>
    );
};