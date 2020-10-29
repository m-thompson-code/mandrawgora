export interface Environment {
    env: 'prod' | 'dev' | 'staging';
    firebaseConfig: {
        apiKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId: string;
    };
    adminEmails: string[];
    header: string;
    copyright: string;
}
