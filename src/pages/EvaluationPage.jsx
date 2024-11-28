import React from 'react';
import styles from './EvaluationPage.module.css';

const NavigationMenu = () => {
    const menuItems = [
        'recommendation',
        'model',
        'dataset',
        'test'
    ];

    return (
        <nav className={styles.navigation}>
        {menuItems.map((item, index) => (
            <button key={index} className={styles.navButton}>
            {item}
            </button>
        ))}
        </nav>
    );
};

const CreateTaskButton = () => {
    return (
        <button className={styles.createButton}>
            <div className={styles.buttonIcon}>
            <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/c77db6e119283b86a7421f874b6e6ebacb3a5fc737f3657545df067e5f8cc739?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                alt="Create new task"
                className={styles.icon}
            />
            </div>
            <span className={styles.buttonText}>create evaluation task</span>
        </button>
    );
};

const TableHeader = () => {
    const headers = [
        { label: 'TASK NAME', sortable: false },
        { label: 'MODEL', sortable: true },
        { label: 'TYPE', sortable: true },
        { label: 'DATASET', sortable: true },
        { label: 'CREATE TIME', sortable: true },
        { label: 'STATUS', sortable: true },
        { label: 'AVERAGE SCORE', sortable: false },
        { label: 'OPERATION', sortable: false }
    ];
  
    return (
        <div className={styles.tableHeader}>
            {headers.map((header, index) => (
            <div key={index} className={styles.headerCell}>
                <div className={styles.headerContent}>
                <span>{header.label}</span>
                {header.sortable && (
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/bd970aaa3a315e6935016adc063d7fdd1b2e73c6794539718568edef0ab30b0e?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                        alt="Sort indicator"
                        className={styles.sortIcon}
                    />
                )}
                </div>
            </div>
            ))}
        </div>
    );
};

const TableRow = ({ data, isAlternate }) => {
    const getStatusClass = (status) => {
        const statusMap = {
            'Evaluating': styles.statusEvaluating,
            'Completed': styles.statusCompleted,
            'Failed': styles.statusFailed,
            'Commercial': styles.statusCommercial
        };
        return statusMap[status] || '';
    };
  
    return (
        <div className={`${styles.tableRow} ${isAlternate ? styles.alternateRow : ''}`}>
            <div className={styles.cell}>{data.taskName}</div>
            <div className={`${styles.cell} ${styles.modelCell}`}>{data.model}</div>
            <div className={styles.cell}>{data.type}</div>
            <div className={`${styles.cell} ${styles.datasetCell}`}>{data.dataset}</div>
            <div className={styles.cell}>{data.createTime}</div>
            <div className={styles.cell}>
            <div className={styles.statusContainer}>
                <div className={`${styles.status} ${getStatusClass(data.status)}`}>
                {data.status}
                </div>
            </div>
            </div>
            <div className={styles.cell}>{data.averageScore}</div>
            <img
            loading="lazy"
            src={data.operationIcon}
            alt="Operation actions"
            className={styles.operationIcon}
            />
        </div>
    );
};

const TablePagination = () => {
    return (
        <div className={styles.paginationContainer}>
            <div className={styles.paginationInfo}>
            The evaluation may take a few days, click to check the progress.
            </div>
            <div className={styles.paginationControls}>
            <div className={styles.rowsPerPage}>
                <span>Rows per page: 10</span>
                <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/959ed80e60f1b5c0baac209dc2dfb2a35f0faad01cab5330e12aa82e9c6d8c20?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                alt="Select rows per page"
                className={styles.dropdownIcon}
                />
            </div>
            <div className={styles.pageNavigation}>
                <span>1-10 of 70</span>
                <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/69a06e563adf1ecea564d5b6f5fc6220505ab98263fdbd6d33bfd50b29885e58?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                alt="Previous page"
                className={styles.navigationIcon}
                />
                <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/0268a1581e0b10a7501c069486face250b8dca69471a4d6c94dd4fc1a4eef0df?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                alt="Next page"
                className={styles.navigationIcon}
                />
            </div>
            </div>
        </div>
    );
};

export const EvaluationPage = () => {
    const tableData = [
        {
            taskName: 'TEST 3',
            model: 'Claude 3.5 Sonnet',
            type: 'Large Language',
            dataset: 'RANK',
            createTime: '2024/10/30',
            status: 'Evaluating',
            averageScore: '',
            operationIcon: 'https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/bb9036663f790888737855f55b1ddd03601bb01f36ca720d1eef71f19befda69?apiKey=bb430c3e8b334ca88c8eb365e68e180d&'
        },
        // Additional rows with similar structure...
    ];
  
    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
            <div className={styles.brandSection}>
                <div className={styles.brand}>
                <span>ModeLabs</span>
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/03ec341d032c1970f92b14cf059154e680663ea545469daa15ca01a5cc31437b?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                    alt="ModeLabs logo"
                    className={styles.brandLogo}
                />
                </div>
                <NavigationMenu />
                <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/8153d81b6e35f4de31b8edc0a058e0f25177e9c5ead12099c2a359dd3ebfcf68?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                alt="User profile"
                className={styles.profileImage}
                />
            </div>
            <div className={styles.titleSection}>
                <h1 className={styles.pageTitle}>My Evaluation</h1>
                <CreateTaskButton />
            </div>
            </header>
    
            <main className={styles.mainContent}>
            <TableHeader />
            {tableData.map((row, index) => (
                <TableRow
                key={index}
                data={row}
                isAlternate={index % 2 === 1}
                />
            ))}
            <TablePagination />
            </main>
        </div>
    );
};