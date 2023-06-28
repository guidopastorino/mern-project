import React from 'react';
import { Link } from 'react-router-dom';

const HashWords = ({ text }) => {
    const words = text.split(' ');

    const transformWord = (word) => {
        let path = '';
        let transformedWord = word;

        if (word.startsWith('#')) {
            path = `/hashtags/${word.substring(1)}`;
            transformedWord = word.replace('#', '#');
        } else if (word.startsWith('@')) {
            path = `/${word.substring(1)}`;
            transformedWord = word.replace('@', '@');
        }

        return (
            <Link to={path} className="text-blue-500 hover:underline">
                {transformedWord}
            </Link>
        );
    };

    const transformedText = words.map((word, index) => {
        if (word.startsWith('#') || word.startsWith('@')) {
            return (
                <React.Fragment key={index}>
                    {transformWord(word)}
                    {' '}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment key={index}>
                    {word}
                    {' '}
                </React.Fragment>
            );
        }
    });

    return <div>{transformedText}</div>;
};

export default HashWords;