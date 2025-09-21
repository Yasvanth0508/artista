import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    addDoc,
    writeBatch,
    runTransaction,
    query,
    where,
    Timestamp,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '@/Login/firebaseConfig';
import { Product, UserProfile, NewProductData, Artist } from '../types';

class DBService {
    private productsCol = collection(db, 'products');
    private usersCol = collection(db, 'users');

    private getUserDocRef() {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("No authenticated user");
        return doc(this.usersCol, currentUser.uid);
    }

    public async init(): Promise<void> {
        const userDocRef = this.getUserDocRef();
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            const defaultUser: UserProfile = {
                name: '',
                avatarUrl: 'https://picsum.photos/seed/user/200/200',
                phone: '',
                bio: '',
                id: ''
            };
            await setDoc(userDocRef, {
                profile: defaultUser,
                followedArtists: []
            });
        }
    }

    // ---------------- PRODUCT METHODS ----------------

    public async getProducts(): Promise<Product[]> {
        const snapshot = await getDocs(this.productsCol);
        return snapshot.docs.map(doc => ({ ...(doc.data() as Product), id: doc.id }));
    }

    public async getUserProducts(ownerId: string): Promise<Product[]> {
        if (!ownerId) throw new Error("ownerId is required");

        try {
            const q = query(this.productsCol, where("ownerId", "==", ownerId));
            const snapshot = await getDocs(q);

            const products: Product[] = snapshot.docs.map(doc => {
                return { id: doc.id, ...(doc.data() as Product) };
            });

            return products;
        } catch (error) {
            console.error("Failed to fetch user products:", error);
            return [];
        }
    }

    public async addProduct(productData: NewProductData, artistProfile: UserProfile): Promise<Product> {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("User not logged in");

        const artist: Artist = {
            id: currentUser.uid,
            name: artistProfile.name || "Unknown Artist",
            avatarUrl: artistProfile.avatarUrl ?? "https://picsum.photos/seed/user/200/200",
            location: 'Online',
            bio: artistProfile.bio || "",
            phone: artistProfile.phone || "",
        };

        const newProductData: Omit<Product, 'id'> = {
            title: productData.title,
            artist,
            images: productData.images,
            description: productData.description,
            details: productData.details,
            price: productData.price,
            currency: '₹',
            tags: productData.tags,
            postedAt: serverTimestamp(),
            views: 0,
            sales: 0,
            rating: 0,
            artType: productData.artType,
            ownerId: currentUser.uid,
        };
        const docRef = await addDoc(this.productsCol, newProductData);
        const newProduct: Product = { ...newProductData, id: docRef.id };
        await updateDoc(docRef, { id: docRef.id });
        return newProduct;
    }

    public async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
        if (!auth.currentUser) throw new Error("User not logged in");
        const productRef = doc(this.productsCol, productId);
        const dataToUpdate = { ...productData };
        delete dataToUpdate.artist;
        delete dataToUpdate.ownerId;
        delete dataToUpdate.postedAt;

        await updateDoc(productRef, dataToUpdate);
        const updatedDoc = await getDoc(productRef);
        return { ...(updatedDoc.data() as Product), id: updatedDoc.id };
    }

    public async deleteProduct(productId: string): Promise<void> {
        if (!auth.currentUser) throw new Error("User not logged in");
        const productRef = doc(this.productsCol, productId);
        await deleteDoc(productRef);
    }

    // ---------------- USER METHODS ----------------

    private async getUserData(): Promise<any | null> {
        const userDocRef = this.getUserDocRef();
        const docSnap = await getDoc(userDocRef);
        return docSnap.exists() ? docSnap.data() : null;
    }

    public async getFollowedArtists(): Promise<string[]> {
        const userData = await this.getUserData();
        return userData?.followedArtists || [];
    }

    public async setFollowedArtists(ids: string[]): Promise<void> {
        const userDocRef = this.getUserDocRef();
        await setDoc(userDocRef, { followedArtists: ids }, { merge: true });
    }

    public async getCurrentUser(): Promise<UserProfile> {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");
        const userDocRef = this.getUserDocRef();
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const profile = docSnap.data()?.profile as UserProfile;
            return { ...profile, id: user.uid };
        }
        return {
            name: "",
            id: user.uid,
            avatarUrl: "https://picsum.photos/seed/user/200/200",
            phone: "",
            bio: "",
        };
    }

    public async updateCurrentUser(updatedUser: UserProfile): Promise<UserProfile> {
        const user = auth.currentUser;
        if (!user) throw new Error('No logged-in user');

        const userDocRef = doc(this.usersCol, user.uid);
        await setDoc(userDocRef, { profile: updatedUser }, { merge: true });
        return updatedUser;
    }
}

export const dbService = new DBService();
