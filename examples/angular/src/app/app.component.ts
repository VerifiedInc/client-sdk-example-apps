import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerifiedSdkComponent } from './verified-sdk/verified-sdk.component';
import {
  SdkResult,
  SdkError,
  SdkResultValues,
} from '@verifiedinc-public/client-sdk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VerifiedSdkComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'client-sdk-angular-example';

  // This property will store the session key
  sessionKey = '';

  // Track loading state
  isLoading = true;

  constructor() {
    // Initialize the session key when component is created
    this.initializeSessionKey();
  }

  /**
   * Initialize the session key asynchronously
   */
  private async initializeSessionKey(): Promise<void> {
    try {
      this.isLoading = true;
      this.sessionKey = await this.getSessionKey();
    } catch (error) {
      console.error('Failed to get session key:', error);
      // Handle the error appropriately (e.g., show error UI)
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get a session key for the Verified SDK
   *
   * FOR DEMO PURPOSES ONLY
   * In a real application, this would be an API call to your backend service
   * which would securely generate and return a valid session key.
   *
   * The backend would typically make a call to Verified.inc's API:
   * POST /client/1-click
   *
   * @returns {Promise<string>} A promise that resolves to a session key
   */
  private getSessionKey(): Promise<string> {
    // This simulates a network request to your backend
    return new Promise((resolve, reject) => {
      // Simulate network latency (300-800ms)
      const delay = 300 + Math.random() * 500;

      setTimeout(() => {
        try {
          // Simulate occasional errors (10% chance)
          if (Math.random() < 0.1) {
            reject(new Error('Failed to get session key from backend'));
            return;
          }

          // For demo, we return a simple mock key
          resolve('944f1615-0d78-4d9f-9e66-2926e5a5119e'); // <--- Replace with a real session key
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  // These methods need to be public to be bound to the component inputs
  handleSdkResult = (result: SdkResult): void => {
    console.log('SDK Result:', result);

    switch (result.type) {
      case SdkResultValues.USER_SHARED_CREDENTIALS:
        console.log(
          'User shared credentials with identity UUID:',
          result.identityUuid
        );
        // Here you would pass the identityUuid to your backend
        break;
      case SdkResultValues.USER_OPTED_OUT:
        console.log('User opted out of sharing credentials');
        // Redirect to your manual signup flow
        break;
    }
  };

  handleSdkError = (error: SdkError): void => {
    console.error('SDK Error:', error);
    // Handle errors according to your application needs
  };
}
