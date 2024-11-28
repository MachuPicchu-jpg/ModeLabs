import React from 'react'
import styles from './ModelManagement.module.css'

const modelData = [
    {
        name: 'microsoft/PmniParser',
        tag: 'Image-Text-to-Text',
        updateTime: 'Updated about 8 hours ago'
    },
    {
        name: 'THU/crazy',
        tag: 'Any-to Any',
        updateTime: 'Updated about 1 days ago'
    },
    {
        name: 'THU/crazy',
        tag: 'Any-to Any',
        updateTime: 'Updated about 1 days ago'
    },
    {
        name: 'THU/crazy',
        tag: 'Any-to Any',
        updateTime: 'Updated about 1 days ago'
    },
    {
        name: 'THU/crazy',
        tag: 'Any-to Any',
        updateTime: 'Updated about 1 days ago'
    }
];

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoSection}>
            <div className={styles.logoText}>ModeLabs</div>
            <img
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/03ec341d032c1970f92b14cf059154e680663ea545469daa15ca01a5cc31437b?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                alt=""
                className={styles.logoIcon}
            />
            </div>
            <div className={styles.navigationSection}>
            <nav className={styles.navigation}>
                <button className={styles.navButton} tabIndex={0}>recommendation</button>
                <button className={styles.navButton} tabIndex={0}>model</button>
                <button className={styles.navButton} tabIndex={0}>dataset</button>
                <button className={styles.navButton} tabIndex={0}>test</button>
            </nav>
            <img
                src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/8153d81b6e35f4de31b8edc0a058e0f25177e9c5ead12099c2a359dd3ebfcf68?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                alt=""
                className={styles.profileIcon}
            />
            </div>
        </header>
    );
};

const ModelForm = () => {
    return (
      <form className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="modelName" className={styles.formLabel}>Model name</label>
          <input
            id="modelName"
            type="text"
            className={styles.formInput}
            placeholder="Please enter your model name"
            aria-label="Model name input"
          />
        </div>
  
        <div className={styles.formGroup}>
          <label htmlFor="dimension" className={styles.formLabel}>Dimension</label>
          <input
            id="dimension"
            type="text"
            className={styles.formInput}
            placeholder="Please input your model's dimension"
            aria-label="Dimension input"
          />
        </div>
  
        <div className={styles.formGroup}>
          <label htmlFor="organization" className={styles.formLabel}>Organization</label>
          <input
            id="organization"
            type="text"
            className={styles.formInput}
            placeholder="Please input the name of release organization"
            aria-label="Organization input"
          />
        </div>
  
        <div className={styles.formGroup}>
          <label htmlFor="releaseDate" className={styles.formLabel}>Release Date</label>
          <div className={styles.dateInputWrapper}>
            <input
              id="releaseDate"
              type="text"
              className={styles.formInput}
              placeholder="Please select release date"
              aria-label="Release date input"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/12382203790f9dbd2be09b7b987b4ac80eecc66366a106e4b0969c43a0d2f36a?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
              alt=""
              className={styles.calendarIcon}
            />
          </div>
        </div>
  
        <div className={styles.formGroup}>
          <label htmlFor="website" className={styles.formLabel}>Website</label>
          <input
            id="website"
            type="url"
            className={styles.formInput}
            placeholder="Please input website"
            aria-label="Website input"
          />
        </div>
  
        <div className={styles.formGroup}>
          <label htmlFor="introduction" className={styles.formLabel}>Introduction</label>
          <textarea
            id="introduction"
            className={styles.formTextarea}
            placeholder="Please input"
            aria-label="Introduction input"
          />
        </div>
  
        <div className={styles.formActions}>
          <button type="submit" className={styles.uploadButton}>upload</button>
          <button type="button" className={styles.cancelButton}>cancel</button>
        </div>
      </form>
    );
};

const ModelCard = ({ name, tag, updateTime, onEdit, onDelete }) => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.cardContent}>
            <div className={styles.modelInfo}>
                <div className={styles.modelName}>{name}</div>
                <div className={styles.infoWrapper}>
                <div className={styles.modelTag}>{tag}</div>
                <div className={styles.updateTime}>{updateTime}</div>
                </div>
            </div>
            <div className={styles.actionButtons}>
                <button 
                onClick={onEdit}
                className={styles.actionButton}
                aria-label="Edit model"
                tabIndex={0}>
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/df6d7c59e64febec641d4d1ea5a9a57a0f6d81b0b4f3efb2c1215f317814d380?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                    alt=""
                    className={styles.actionIcon}
                />
                </button>
                <button
                onClick={onDelete}
                className={styles.actionButton}
                aria-label="Delete model"
                tabIndex={0}>
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/bb430c3e8b334ca88c8eb365e68e180d/6bab250d9f8c98ccf4692477d25af560296b88dd9ccd8b9800a83cc4a7eb1dbe?apiKey=bb430c3e8b334ca88c8eb365e68e180d&"
                    alt=""
                    className={styles.actionIcon}
                />
                </button>
            </div>
        </div>
      </div>
    );
};

export const ModelManagement = () => {
    return (
      <div className={styles.container}>
        <Header />
        <h1 className={styles.pageTitle}>
          You can upload your models here and manage them.
        </h1>
        <div className={styles.contentWrapper}>
          <div className={styles.formSection}>
            <ModelForm />
          </div>
          <div className={styles.modelList}>
            {modelData.map((model, index) => (
              <ModelCard
                key={index}
                name={model.name}
                tag={model.tag}
                updateTime={model.updateTime}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
            <div className={styles.scrollbar}>
              <div className={styles.scrollbarThumb} />
            </div>
          </div>
        </div>
        <footer className={styles.footer}>
          If you have any suggestions, please contact us:
          caojq22@mails.tsinghua.edu.cn
        </footer>
      </div>
    );
};