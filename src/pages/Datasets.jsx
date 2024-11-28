import React from'react';
import styles from './DatasetManagement.module.css';

const DatasetCard = ({ title, type, description, tags }) => {
    return (
      <div className={styles.datasetCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>{title}</div>
          <div className={styles[type.toLowerCase()]}>{type}</div>
        </div>
        <div className={styles.cardDescription}>{description}</div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/9308ad42aefc95aa78cd2b93448c1293066d1d40d8a58d28dcd8e7a426dbada9?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
          className={styles.cardImage}
          alt=""
        />
        <div className={styles.tagContainer}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.tag}>{tag}</div>
          ))}
        </div>
      </div>
    );
};

const FormInput = ({ label, placeholder, type = "text", hasIcon = false }) => {
    const inputId = `${label.toLowerCase().replace(/\s/g, '-')}-input`;
    
    return (
      <div className={styles.formGroup}>
        <label htmlFor={inputId} className={styles.formLabel}>{label}</label>
        <div className={styles.inputContainer}>
            <input
                type={type}
                id={inputId}
                className={styles.formInput}
                placeholder={placeholder}
                aria-label={label}
            />
            {hasIcon && (
                <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/033cc1fa96381dafc81f42fdd38f969fc0b3603bdd498c5353488dfb7b7d8540?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                className={styles.inputIcon}
                alt=""
                />
          )}
        </div>
      </div>
    );
};

const datasets = [
    {
      title: 'Dataset1',
      type: 'LLM',
      description: "This is a dataset used to test the model's inference capabilities.",
      tags: ['reasoning']
    },
    {
      title: 'Dataset2',
      type: 'LLM',
      description: "This is a dataset used to test the model's math capabilities.",
      tags: ['reasoning', 'math']
    },
    {
      title: 'Dataset3',
      type: 'MM',
      description: "This is a dataset used to test the model's scene capabilities.",
      tags: ['scene']
    }
];

export const DatasetManagement = () => {
    return (
      <div className={styles.datasetManagement}>
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <div>ModeLabs</div>
                <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/03ec341d032c1970f92b14cf059154e680663ea545469daa15ca01a5cc31437b?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                className={styles.logoIcon}
                alt="ModeLabs logo"
                />
            </div>
            <nav className={styles.navigation}>
                <button className={styles.navButton}>recommendation</button>
                <button className={styles.navButton}>model</button>
                <button className={styles.navButton}>dataset</button>
                <button className={styles.navButton}>test</button>
                <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/8153d81b6e35f4de31b8edc0a058e0f25177e9c5ead12099c2a359dd3ebfcf68?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                className={styles.profileIcon}
                alt="User profile"
                />
            </nav>
        </header>
  
        <h1 className={styles.pageTitle}>
          You can upload your datasets here and manage them.
        </h1>
  
        <form className={styles.uploadForm}>
            <FormInput label="Dataset name" placeholder="Please enter your dataset name" />
            <FormInput label="Dimension" placeholder="Select up to 3 dimensions" hasIcon />
            <FormInput label="Organization" placeholder="Please input the name of release organization" />
            <FormInput label="Release Date" placeholder="Please select release date" hasIcon />
            <FormInput label="Website" placeholder="Please input website" />
            <FormInput label="Introduction" placeholder="Please input" />
            
            <div className={styles.formActions}>
                <button type="submit" className={styles.uploadButton}>upload</button>
                <button type="button" className={styles.cancelButton}>cancel</button>
            </div>
        </form>
  
        <div className={styles.datasetsGrid}>
          {datasets.map((dataset, index) => (
            <DatasetCard key={index} {...dataset} />
          ))}
        </div>
  
        <footer className={styles.footer}>
          If you have any suggestions, please contact us: caojq22@mails.tsinghua.edu.cn
        </footer>
      </div>
    );
};