import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import {
  VerifiedClientSdk,
  SdkResult,
  SdkError,
  SdkResultValues,
  SdkErrorReasons,
} from '@verifiedinc-public/client-sdk';

@Component({
  selector: 'app-verified-sdk',
  standalone: true,
  imports: [NgIf],
  template: `
    <div #sdkContainer class="sdk-container">
      <div *ngIf="isLoading" class="loading-container">
        <p>Loading Verified Client SDK...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .sdk-container {
        width: 100%;
        display: block;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
        width: 100%;
      }
    `,
  ],
})
export class VerifiedSdkComponent implements OnInit, OnChanges, OnDestroy {
  @Input() sessionKey: string = '';
  @Input() onResult?: (result: SdkResult) => void;
  @Input() onError?: (error: SdkError) => void;

  @ViewChild('sdkContainer', { static: true }) sdkContainer!: ElementRef;
  private sdkInstance: VerifiedClientSdk | null = null;
  isLoading = true;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if we're in a browser environment
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Only initialize in browser environment and if sessionKey is available
    if (this.isBrowser && this.sessionKey) {
      this.initializeSdk();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only process changes in browser environment
    if (!this.isBrowser) return;

    // Handle sessionKey changes
    if (changes['sessionKey'] && changes['sessionKey'].currentValue) {
      this.isLoading = true;

      // If SDK already exists, destroy it first
      if (this.sdkInstance) {
        this.destroySdk();
      }

      // Initialize SDK with new session key
      this.initializeSdk();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.destroySdk();
    }
  }

  private initializeSdk(): void {
    if (!this.sessionKey) {
      console.error('Session key is required to initialize the Verified SDK');
      return;
    }

    // Initialize the SDK
    this.sdkInstance = new VerifiedClientSdk({
      environment: 'development',
      sessionKey: this.sessionKey,
      onResult: (result: SdkResult) => {
        if (this.onResult) {
          this.onResult(result);
        } else {
          this.handleResult(result);
        }
      },
      onError: (error: SdkError) => {
        if (this.onError) {
          this.onError(error);
        } else {
          this.handleError(error);
        }
      },
    });

    // Render the SDK in the container
    if (this.sdkContainer && this.sdkInstance) {
      this.sdkInstance.show(this.sdkContainer.nativeElement);
      this.isLoading = false;
    } else {
      console.error('SDK container not found or SDK not initialized');
    }
  }

  private destroySdk(): void {
    if (this.sdkInstance) {
      this.sdkInstance.destroy();
      this.sdkInstance = null;
    }
  }

  private handleResult(result: SdkResult): void {
    switch (result.type) {
      case SdkResultValues.USER_SHARED_CREDENTIALS:
        console.log(
          'User shared credentials with identity UUID:',
          result.identityUuid
        );
        // Here you would typically pass the identityUuid to your backend
        break;
      case SdkResultValues.USER_OPTED_OUT:
        console.log('User opted out of sharing credentials');
        // Handle manual signup flow
        break;
      default:
        console.log('Unknown result type:', result);
    }
  }

  private handleError(error: SdkError): void {
    switch (error.reason) {
      case SdkErrorReasons.INVALID_SESSION_KEY:
        console.error(
          'Invalid session key. A new session key should be created.'
        );
        // Here you would typically call your backend to get a new session key
        break;
      case SdkErrorReasons.SESSION_TIMEOUT:
        console.error(
          'Session timed out. A new session key should be created.'
        );
        // Here you would typically call your backend to get a new session key
        break;
      case SdkErrorReasons.SHARE_CREDENTIALS_ERROR:
        console.error('Error sharing credentials.');
        // Handle fallback to manual signup
        break;
      default:
        console.error('Unknown error:', error);
    }
  }
}
